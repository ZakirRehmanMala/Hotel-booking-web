/////////////////routes  
// const express = require("express");
// const router = express.Router();

// const { Listingschema } = require("../schema.js");
// const wrapAsync = require("../utils/wrapAsync.js"); // ✅ sirf ek import rakha
// const ExpressError = require("../utils/expressError.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/review");

// ///validate errors
// const validateListing = (req, res, next) => {
//   let { error } = Listingschema.validate(req.body)
//   if (error) {
//     console.log(error)
//     let errMsg = error.details.map((e) => e.message).join(",")
//     throw new ExpressError(400, errMsg)
//   }
//   else {
//     next()
//   }
// }

// //Index Route
// router.get("/", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya (GET pe body nahi hoti)
//   const allListings = await Listing.find({});
//   res.render("listings/index", { allListings });
//   // console.log(allListings)
// }));

// //New Route
// router.get("/new", (req, res) => {  // ✅ validateListing hata diya
//   res.render("listings/new.ejs");
// });

// //Show Route
// router.get("/:id", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   const listingCount = await Review.countDocuments()
//   console.log(listingCount)
//   if(!listing){
//     req.flash("error","Listing you request does not exist")
//     res.redirect("/listings")
//   }
//   res.render("listings/show.ejs", { listing ,listingCount});
// }));
// //Create Route
// router.post("/", validateListing, wrapAsync(async (req, res, next) => {
//   const newListing = new Listing(req.body.listing); // ✅ await new Listing() → sirf new Listing()
//   await newListing.save();
//   req.flash("success", "New Listing Created")
//   res.redirect("/listings");
// }));
// //Edit Route
// router.get("/:id/edit", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya
//   let { id } = req.params;
//   const listing = await Listing.findById(id);

//   res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// router.put("/:id", validateListing, wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   req.flash("success", "Listing Edited")
//   res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// router.delete("/:id", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   req.flash("delete", "Listing Deleted")
//   res.redirect("/listings");
// }));
// module.exports = router


console.log("LISTINGS ROUTER LOADED");
///////////////// routes/listings.js
const express = require("express");
const router = express.Router();

const { Listingschema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review");
const { isLoggedIn } = require('../middleware.js')
/// Validate errors middleware
const validateListing = (req, res, next) => {
  let { error } = Listingschema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route - show all listings
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New Route - show form to create new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
router.get("/deals", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/deals.ejs", { data: allListings });
});
router.get("/profile", async (req, res) => {
 res.render('listings/profile.ejs')
});
router.get('/liked/:id', isLoggedIn, async (req, res) => {
  // pehli dafa session me favorite array bana lo
  if (!req.session.favorite) {
    req.session.favorite = [];
  }

  // current ID ko array me add karo (agar pehle se nahi hai)
  const id = req.params.id;
  if (!req.session.favorite.includes(id)) {
    req.session.favorite.push(id);
  }

  res.redirect('/listings');  // wapas listings page pe bhej do
});
// Delete Favorite or Listing
router.get('/disliked/:id', isLoggedIn, async (req, res) => {
  try {
    let { id } = req.params;

    // 🧠 Step 1: Database se record delete karo
    await Listing.findByIdAndDelete(id);

    // 🧠 Step 2: agar tu session me favorites store karta hai to wahan se bhi hata do
    if (req.session.favorite) {
      req.session.favorite = req.session.favorite.filter(favId => favId !== id);
    }

    // 🧠 Step 3: flash message (agar use kar raha hai)
    req.flash("success", "Listing deleted successfully!");

    // 🧠 Step 4: redirect back to favorite page
    res.redirect('/listings/favorite');
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while deleting!");
    res.redirect('/listings/favorite');
  }
});


// Favourite Route -
router.get('/favorite', isLoggedIn, async (req, res) => {
  // agar koi favorite nahi hai to empty array bhej do
  const ids = req.session.favorite || [];

  // database se sab listings lao jin ki ID array me hai
  const listings = await Listing.find({ _id: { $in: ids } });
  const likedCount = ids.length;
  res.render('listings/favorite.ejs', {  listings , likedCount });
});

// Show Route - show one listing
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  const listingCount = await Review.countDocuments();

  if (!listing) {
    req.flash("error", "Listing you request does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing, listingCount });
}));

// Create Route - add new listing
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}));

// Edit Route - show form to edit listing
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Update Route - update listing
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Edited");
  res.redirect(`/listings/${id}`);
}));

// Delete Route - delete listing
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("delete", "Listing Deleted");
  res.redirect("/listings");
}));

module.exports = router;

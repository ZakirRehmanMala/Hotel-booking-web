const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// validate listing joi funtion 
const wrapAsync = require("../utils/wrapAsync.js"); // ✅ sirf ek import rakha
const ExpressError = require("../utils/expressError.js");
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        let errMsg = error.details.map((e) => e.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}
//Reviews Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review Saved :", newReview)
    req.flash("success", "Comment sended")
    res.redirect(`/listings/${listing._id}`)
}));
//Reviews Delete Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let reslist = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    console.log(reslist)
    let resreview = await Review.findByIdAndDelete(reviewId)
    console.log(resreview)
    req.flash("success", "Comment Deleted")
    res.redirect(`/listings/${id}`)
}))

module.exports = router
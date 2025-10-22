const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require('bcrypt')
const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync.js')
const { saveRedirectUrl } = require('../middleware.js')
const { isLoggedIn } = require('../middleware.js');
// const Listing = require("../models/listing.js");
router.get("/profile", isLoggedIn, async (req, res) => {
  // Yahan current login user milega
  const user = req.user;  
console.log('user is here : ',user)
  if (!user) {
    req.flash("error", "You must be logged in to view your profile");
    return res.redirect("/login");
  }

  // Profile page render karte waqt user ko pass karo
  res.render("listings/profile.ejs", { user });
});



router.post("/signup", wrapAsync(async (req, res) => {

    let { username, email, mobile, day, month, year, gender, password } = req.body;
    console.log('DETAIL IS HERE : ', username, email, mobile, day, month, year, gender, password)
    // bycrypt 
    // console.log(password)
    // bcrypt.genSalt(10, function (err, salt) {
    //     bcrypt.hash(password, salt, async function (err, hash) {
    //         let user = new User({
    //             username,
    //             email,
    //             password: hash
    //         });
    //         await user.save();

    //         console.log(user)
    //     })
    // })


    let newUser = new User({ email, mobile, day, month, year, gender });
    let registeredUser = await User.register(newUser, password);

    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) { return next(err) }
        req.flash('success', 'Welcome on Wonderlust!')
        res.redirect('/login')
    });


    // res.redirect('/listings')    
    //   let newUser =  await new User({
    //         email:email,
    //         username:username  
    //     })
    //     await User.register(newUser,`${password}`);

}))

//   let fakeUser = new User({
//     email:'zakirmala099@gamil.com',
//     username:'zakirrehman'
//   })
//   let regUser = await User.register(fakeUser,'zakirmala1');
//   res.send(regUser)
// })
// router.post("/signup", wrapAsync(async (req, res) => {
//     let { username, email, password } = req.body;
//     let newUser = new User({ email, username });
//     let registeredUser = await User.register(newUser, password);
//     req.flash('success', 'User was registered successfully');
//     res.redirect("/login");
// }));

router.get("/login", (req, res) => {
    res.render("users/login")
})
// router.post("/login", async (req, res) => {
//     let { email, password } = req.body;
//     let user = await User.findOne({ email: email })
//     if (!user) {
//         console.log("Not Found");
//         res.send("Not Found")
//     }
//     else {
//         // bcrypt.compare(password, user.password, async (err, result) => {
//         //     if (err) { return res.send(err) }
//         //     else {
//         //         if (result) {
//         //             res.redirect("/listings")
//         //         } else {
//         //             console.log("Something went wrong")
//         //             res.send("Something went wrong")
//         //         }

//         //     }
//         // })

//     }

// })
router.post('/login', saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function async(req, res) {
        req.flash('success', 'Welcome to Wanderlust! you are logged in. ');
        if (res.locals.redirectUrl) {
            res.redirect(res.locals.redirectUrl)
        }

        res.redirect('/listings')
    });
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err)
        }
        req.flash('success', 'Your are logged out')
        res.redirect('/listings')
    })
})
module.exports = router
const express = require("express");
// const cookieParser = require("cookie-parser");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(cookieParser())
// app.use(cookieParser("secretcode"))
// const users = require("./user.js")
// const posts = require("./post.js")
// app.get("/", async (req, res) => {
//     console.dir(req.cookies)
//     res.send("Hi, I am root");
// });
// app.get("/getsignedcookie", async (req, res) => {

//     res.cookie("name","hammadkhalpawalpa" , {signed:true});
//     res.send("Signed Cookie send")
// });
// app.get("/verify", async (req, res) => {
// //   console.log(req.cookies)
//   console.dir(req.signedCookies)
//   res.send("verify")
// });
// app.get("/greet", async (req, res) => {
//     let { name = "anonyams" } = req.cookies
//     res.send(`<h1>How Are You Mr ${name}</h1>`);
// });`

// app.get("/sendcookies", (req, res) => {
//     res.cookie("www.zakirmala.com", "Pakistan")
//     res.cookie("from", "Karachi")
//     res.cookie("userid", "1233")
//     res.send("Sending Cookies")
// })

// app.use("/", users)
// app.use("/", posts)

//////////////////////
// app.use(session({ secret: "mysuppersecratestring"   resave: true,saveUninitialized: true}))
let sessionOption = {
    secret: "mysuppersecratestring",
    resave: true,
    saveUninitialized: true
}
app.use(session(sessionOption))
app.use(flash());
// app.get("/test", async (req, res) => {

//     res.send("send sucessfully");
// });
// app.get("/countsession", async (req, res) => {
//     if (req.session.count) {
//         req.session.count++
//     }
//     else {
//         req.session.count = 1
//     }
//     res.send(`You send the request ${req.session.count} time`);
// });

app.get("/registry", async (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name
    // console.log(req.session.name)
    if (name == 'anonymous') {
        req.flash("failed", "user reqisterd Failed")

    } else {
        req.flash("success", "user reqisterd successfully")
    }
    // res.send(name);
    res.redirect("/hello")
});
app.get("/hello", async (req, res) => {
    // res.send(`Hello Mr :${req.session.name}`);
    // first method/////
    // res.render("page.ejs", { name: req.session.name, msg: req.flash("success") })
    // second method/////
    res.locals.SuccessMsg = req.flash("success")
    res.locals.failedMsg = req.flash("failed")
    res.render("page.ejs", { name: req.session.name })
});

app.listen(3030, () => {
    console.log("server is listening to port 8083");
});
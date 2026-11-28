import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { User } from "../models/user.js";
import passport from "passport";
import { isLoggedIn, saveReturnToUrl, validateUser } from "../middleware.js";

const userRouter = express.Router({ mergeParams: true });

userRouter.route("/signup")
    .get(
        wrapAsync(async (req, res) => {
            return res.render("Users/signup.ejs");
        })
    )
    .post(
        validateUser,
        wrapAsync(async (req, res, next) => {
            const { username, email, password } = req.body.user;
            const newUser = new User({ username, email });
            const registeredUser = await User.register(newUser, password);
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "User created and logged in successfully!");
                return res.redirect("/Listings");
            });
        })
    );

userRouter.route("/login")
    .get(
        wrapAsync(async (req, res) => {
            return res.render("Users/login.ejs");
        })
    )
    .post(
        saveReturnToUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        wrapAsync(async (req, res) => {
            req.flash("success", "successfully logged in!");
            const redirectUrl = res.locals.returnToUrl || "/Listings";
            return res.redirect(redirectUrl);
        })
    );

userRouter.get(
    "/logout",
    isLoggedIn,
    wrapAsync(async (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You have been logged out!");
            return res.redirect("/Listings");
        });
    })
);

export { userRouter };

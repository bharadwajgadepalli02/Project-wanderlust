import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { User } from "../models/user.js";
import passport from "passport";
import { isLoggedIn, saveReturnToUrl, validateUser } from "../middleware.js";

const userRouter = express.Router({ mergeParams: true });

userRouter.get(
    "/signup",
    wrapAsync(async (req, res) => {
        res.render("Users/signup.ejs");
    })
);

userRouter.post(
    "/signup",
    validateUser,
    wrapAsync(async (req, res) => {
        const { username, email, password } = req.body.user;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                throw new ExpressError("Error occurred while logging in", 500);
            }

            req.flash("success", "User created and logged in successfully!");
            res.redirect("/Listings");
        });
    })
);

userRouter.get(
    "/login",
    wrapAsync(async (req, res) => {
        res.render("Users/login.ejs");
    })
);

userRouter.post(
    "/login",
    saveReturnToUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(async (req, res) => {
        req.flash("success", "successfully logged in!");
        const redirectUrl = res.locals.returnToUrl || "/Listings";
        res.redirect(redirectUrl);
    })
);

userRouter.get(
    "/logout",
    isLoggedIn,
    wrapAsync(async (req, res) => {
        req.logout((err) => {
            if (err) {
                throw new ExpressError("Error occurred while logging out", 500);
            }

            req.flash("success", "You have been logged out!");
            res.redirect("/Listings");
        });
    })
);

export { userRouter };
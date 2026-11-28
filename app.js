import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { Listing } from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import ejsmate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "./models/user.js";

import { listingRouter } from "./routes/listingRoute.js";
import { reviewRouter } from "./routes/reviewRoue.js";
import { userRouter } from "./routes/userRoute.js";

const app = express();
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use(express.static(path.join(__dirname, "node_modules/@fortawesome/fontawesome-free")));

const PORT = process.env.PORT || 8080;
const CONNECTION_URL = process.env.ATLASDB_URL;
const SECRET = process.env.SECRET || "mysupersecretcode12345";

const main = async (url) => {
    await mongoose.connect(url);
};

main(CONNECTION_URL)
    .then(() => {
        console.log("Database is connected successfully");
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

const store = MongoStore.create({
    mongoUrl: CONNECTION_URL,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.update = req.flash("update");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    return res.redirect("/Listings");
});

app.get("/help", (req, res) => {
    return res.render("help.ejs");
});

app.use("/Listings", listingRouter);
app.use("/Listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use((req, res, next) => {
    next(new ExpressError("sorry!, <b>Page Not Found.</b>", 404));
});

app.use((err, req, res, next) => {
    if (err.statusCode !== 404) {
        console.error("Unhandled Error:", err);
    }
    if (res.headersSent) {
        return next(err);
    }
    const { statusCode = 500, message = "Something went wrong" } = err;
    return res.status(statusCode).render("Listings/error.ejs", { message });
});

import express from "express";
import mongoose from "mongoose";
import { Listing } from "./models/listing.js";
import { data } from "./models/data.js";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import ejsmate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
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

const PORT = 8080;
const CONNECTION_URL = "mongodb://127.0.0.1:27017/wanderlust";

const main = wrapAsync(async (CONNECTION_URL) => {
    await mongoose.connect(CONNECTION_URL);
});

const initdatabase = wrapAsync(async (bulkData = []) => {
    await Listing.deleteMany({});
    await Listing.insertMany(bulkData);
});

main(CONNECTION_URL, PORT)
    .then(() => {
        console.log("Database is connected successfully");
        // initdatabase(data);
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });

const sessionOptions = {
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
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
    res.redirect("/Listings");
});

app.use("/Listings", listingRouter);
app.use("/Listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
    next(new ExpressError("sorry!, <b>Page Not Found.</b>", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("Listings/error.ejs", { message });
});

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
import listingSchema from "./schema.js";

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
app.use(
    express.static(
        path.join(__dirname, "node_modules/@fortawesome/fontawesome-free"),
    ),
);

const PORT = 8080;
const CONNECTION_URL = "mongodb://127.0.0.1:27017/wanderlust";

const main = async (CONNECTION_URL) => {
    await mongoose.connect(CONNECTION_URL);
};

const initdatabase = async (bulkData = []) => {
    await Listing.deleteMany({});
    await Listing.insertMany(bulkData);
};

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    }

    next();
};

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

app.get("/", (req, res) => {
    res.redirect("/Listings");
});

app.get(
    "/Listings",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("Listings/index.ejs", { allListings });
    }),
);

app.get(
    "/Listings/new",
    wrapAsync(async (req, res) => {
        res.render("Listings/create.ejs", { listing: { image: {} } });
    }),
);

app.get(
    "/Listings/:id",
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        res.render("Listings/show.ejs", { listing });
    }),
);

app.get(
    "/Listings/:id/new",
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        res.render("Listings/create.ejs", { listing });
    }),
);

app.post(
    "/Listings",
    validateListing,
    wrapAsync(async (req, res) => {
        const listing = new Listing(req.body.listing);
        await listing.save();
        res.redirect("/Listings");
    }),
);

app.patch(
    "/Listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findByIdAndUpdate(req.params.id, {
            ...req.body.listing,
        });
        res.redirect("/Listings");
    }),
);

app.delete(
    "/Listings/:id",
    wrapAsync(async (req, res) => {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        console.log("Deleted Listing:", listing);
        res.redirect("/Listings");
    }),
);

app.use((req, res, next) => {
    next(new ExpressError("sorry!, <b>Page Not Found.</b>", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("Listings/error.ejs", { message });
});

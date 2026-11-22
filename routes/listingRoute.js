import express from "express";
import { Listing } from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";

const listingRouter = express.Router();



listingRouter.get(
    "",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        if (!allListings) {
            req.flash("error", "No listings found!");
        }
        res.render("Listings/index.ejs", { allListings });
    })
);

listingRouter.get(
    "/new",
    isLoggedIn,
    wrapAsync(async (req, res) => {
        res.render("Listings/create.ejs", { listing: { image: {} } });
    })
);

listingRouter.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/Listings");
        }
        res.render("Listings/show.ejs", { listing });
    })
);

listingRouter.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/Listings");
        }
        res.render("Listings/create.ejs", { listing });
    })
);

listingRouter.post(
    "",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const listing = new Listing(req.body.listing);
        listing.owner = req.user._id; 
        await listing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/Listings");
    })
);

listingRouter.patch(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findByIdAndUpdate(req.params.id, {
            ...req.body.listing,
        });
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/Listings");
        }
        req.flash("update", "Listing updated successfully!");
        res.redirect("/Listings");
    })
);

listingRouter.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/Listings");
        }
        req.flash("update", "Listing deleted successfully!");
        res.redirect("/Listings");
    })
);

export { listingRouter };
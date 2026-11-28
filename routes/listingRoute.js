import express from "express";
import { Listing } from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import multer from "multer";
import { cloudinary, storage } from "../cloudConfig.js";

const upload = multer({ storage });

let geocodingClient = null;
try {
    const mapToken = process.env.MAP_TOKEN;
    if (mapToken && mapToken.startsWith("pk.")) {
        geocodingClient = mbxGeocoding({ accessToken: mapToken });
    }
} catch (err) {
    console.error("Mapbox token initialization error:", err.message);
    geocodingClient = null;
}

const listingRouter = express.Router();

// Routes for "/" (Index & Create)
listingRouter.route("/")
    .get(
        wrapAsync(async (req, res) => {
            const { search, category } = req.query;
            let page = parseInt(req.query.page, 10);
            if (isNaN(page) || page < 1) page = 1;
            const limit = 9;

            const filterQuery = {};

            if (search && search.trim() !== "") {
                const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const regex = new RegExp(safeSearch, "i");
                filterQuery.$or = [
                    { title: regex },
                    { location: regex },
                    { country: regex }
                ];
            }

            if (category && category.trim() !== "" && category !== "All") {
                filterQuery.category = category.trim();
            }

            const totalListings = await Listing.countDocuments(filterQuery);
            const totalPages = Math.ceil(totalListings / limit) || 1;
            const currentPage = Math.min(page, totalPages);
            const skip = (currentPage - 1) * limit;

            const allListings = await Listing.find(filterQuery)
                .skip(skip)
                .limit(limit);

            return res.render("Listings/index.ejs", {
                allListings,
                currentPage,
                totalPages,
                totalListings,
                search: search ? search.trim() : "",
                currentCategory: category || "All",
            });
        })
    )
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(async (req, res) => {
            try {
                let geoData = { type: "Point", coordinates: [77.2090, 28.6139] };
                if (geocodingClient && req.body.listing.location) {
                    try {
                        const response = await geocodingClient.forwardGeocode({
                            query: `${req.body.listing.location}, ${req.body.listing.country || ""}`,
                            limit: 1,
                        }).send();
                        if (response.body.features && response.body.features.length) {
                            geoData = response.body.features[0].geometry;
                        }
                    } catch (err) {
                        console.error("Geocoding failed, using fallback coordinates:", err);
                    }
                }

                const newListing = new Listing(req.body.listing);
                newListing.owner = req.user._id;
                newListing.geometry = geoData;
                if (!newListing.tax) {
                    newListing.tax = [5, 12, 18, 28][Math.floor(Math.random() * 4)];
                }

                if (typeof req.file !== "undefined") {
                    newListing.image = {
                        url: req.file.secure_url || req.file.path,
                        filename: req.file.originalname || req.file.filename,
                    };
                }

                await newListing.save();
                req.flash("success", "Successfully created a new listing!");
                return res.redirect("/Listings");
            } catch (err) {
                if (req.file && req.file.filename) {
                    try {
                        await cloudinary.uploader.destroy(req.file.filename);
                    } catch (destroyErr) {
                        console.error("Failed to clean up newly uploaded file:", destroyErr);
                    }
                }
                throw err;
            }
        })
    );

// Route for "/new" (Must precede "/:id")
listingRouter.get(
    "/new",
    isLoggedIn,
    wrapAsync(async (req, res) => {
        return res.render("Listings/create.ejs", { listing: {} });
    })
);

// Route for "/:id/edit"
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
        let originalImageUrl = listing.image?.url || "";
        if (originalImageUrl.includes("/upload")) {
            originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        }
        return res.render("Listings/create.ejs", { listing, originalImageUrl });
    })
);

// Routes for "/:id" (Show, Update, Delete)
listingRouter.route("/:id")
    .get(
        wrapAsync(async (req, res) => {
            const listing = await Listing.findById(req.params.id)
                .populate({ path: "reviews", populate: { path: "author" } })
                .populate("owner");
            if (!listing) {
                req.flash("error", "Listing not found!");
                return res.redirect("/Listings");
            }
            return res.render("Listings/show.ejs", { 
                listing, 
                mapToken: process.env.MAP_TOKEN || "" 
            });
        })
    )
    .patch(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(async (req, res) => {
            const listing = await Listing.findById(req.params.id);
            if (!listing) {
                if (req.file && req.file.filename) {
                    try {
                        await cloudinary.uploader.destroy(req.file.filename);
                    } catch (destroyErr) {
                        console.error("Failed to clean up unused uploaded file:", destroyErr);
                    }
                }
                req.flash("error", "Listing not found!");
                return res.redirect("/Listings");
            }

            const oldImageFilename = listing.image?.filename;

            try {
                if (geocodingClient && req.body.listing.location && req.body.listing.location !== listing.location) {
                    try {
                        const response = await geocodingClient.forwardGeocode({
                            query: `${req.body.listing.location}, ${req.body.listing.country || ""}`,
                            limit: 1,
                        }).send();
                        if (response.body.features && response.body.features.length) {
                            req.body.listing.geometry = response.body.features[0].geometry;
                        }
                    } catch (err) {
                        console.error("Geocoding failed during update:", err);
                    }
                }

                const updatedListing = await Listing.findByIdAndUpdate(req.params.id, {
                    ...req.body.listing,
                }, { runValidators: true, new: true });

                if (typeof req.file !== "undefined") {
                    updatedListing.image = {
                        url: req.file.secure_url || req.file.path,
                        filename: req.file.originalname || req.file.filename,
                    };
                    await updatedListing.save();

                    if (oldImageFilename && oldImageFilename !== req.file.filename) {
                        try {
                            await cloudinary.uploader.destroy(oldImageFilename);
                        } catch (destroyErr) {
                            console.error("Failed to delete previous image from Cloudinary:", destroyErr);
                        }
                    }
                }

                req.flash("update", "Listing updated successfully!");
                return res.redirect(`/Listings/${req.params.id}`);
            } catch (err) {
                if (req.file && req.file.filename) {
                    try {
                        await cloudinary.uploader.destroy(req.file.filename);
                    } catch (destroyErr) {
                        console.error("Failed to clean up newly uploaded file on update error:", destroyErr);
                    }
                }
                throw err;
            }
        })
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(async (req, res) => {
            const listing = await Listing.findByIdAndDelete(req.params.id);
            if (!listing) {
                req.flash("error", "Listing not found!");
                return res.redirect("/Listings");
            }
            if (listing.image && listing.image.filename) {
                try {
                    await cloudinary.uploader.destroy(listing.image.filename);
                } catch (destroyErr) {
                    console.error("Failed to delete image from Cloudinary upon deletion:", destroyErr);
                }
            }
            req.flash("update", "Listing deleted successfully!");
            return res.redirect("/Listings");
        })
    );

export { listingRouter };

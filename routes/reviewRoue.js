import express from "express";
import { Listing } from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import { Review } from "../models/review.js";
import { isLoggedIn, isReviewOwner, validateReview } from "../middleware.js";

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/Listings");
        }
        const review = new Review(req.body.review);
        review.author = req.user._id;
        listing.reviews.push(review);
        await review.save();
        await listing.save();
        req.flash("success", "Review added successfully");
        res.redirect(`/Listings/${listing._id}`);
    })
);

reviewRouter.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewOwner,
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        const review = await Review.findByIdAndDelete(reviewId);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/Listings");
        }
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/Listings/${id}`);
        }
        console.log("Deleted Review:", review);
        console.log("Review deleted from the Listing:", listing);
        req.flash("update", "Review deleted successfully");
        res.redirect(`/Listings/${id}`);
    })
);

export { reviewRouter };
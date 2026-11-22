import { Listing } from "./models/listing.js";
import { Review } from "./models/review.js";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema, reviewSchema, userSchema } from "./schema.js";

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to do that!"); 
        req.session.returnToUrl = req.originalUrl;       
        return res.redirect("/login");
    }
    next();
};

const saveReturnToUrl = (req, res, next) => {
    if (req.session.returnToUrl) {
        res.locals.returnToUrl = req.session.returnToUrl;
    }
    next();
};

const isOwner = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/Listings");
    }
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/Listings/${id}`);
    }
    next();
});

const isReviewOwner = wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/Listings/${id}`);
    }
    if (!review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/Listings/${id}`);
    }
    next();
});

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    }

    next();
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    }

    next();
};

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    }

    next();
};

export { isLoggedIn, saveReturnToUrl, isOwner, isReviewOwner, validateListing, validateReview, validateUser };
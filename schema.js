import Joi from "joi";

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
        }).allow("", null).optional(),
        price: Joi.number().positive().required(),
        tax: Joi.number().min(0).max(100).optional(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().valid(
            "Trending",
            "Rooms",
            "Iconic Cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic",
            "Domes",
            "Boats"
        ).optional()
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
});

const userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    }).required()
});

export { listingSchema, reviewSchema, userSchema };

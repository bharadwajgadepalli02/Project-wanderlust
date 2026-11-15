import Joi from "joi";

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
        }),
        price: Joi.number().positive().required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});

export default listingSchema;
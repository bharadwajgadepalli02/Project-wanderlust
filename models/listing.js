import mongoose, { Schema } from "mongoose";

const DEFAULT_IMAGE_URL =
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

const listingSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: DEFAULT_IMAGE_URL,
            set: (url) => url || DEFAULT_IMAGE_URL,
        },
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
export { Listing };

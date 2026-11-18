import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);
export { Review };

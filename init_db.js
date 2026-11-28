import "dotenv/config";
import mongoose from "mongoose";
import { data } from "./models/data.js";
import { Listing } from "./models/listing.js";
import { User } from "./models/user.js";

const DB_URL = process.env.ATLASDB_URL;

async function seedDB() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(DB_URL);
        console.log("Database connected successfully.");

        const deleted = await Listing.deleteMany({});
        console.log(`Cleared existing listings (${deleted.deletedCount} removed).`);

        const defaultUser = await User.findOne({});
        const ownerId = defaultUser ? defaultUser._id : null;

        const TAX_TIERS = [5, 12, 18, 28];
        const preparedData = data.map((item, index) => ({
            ...item,
            owner: ownerId,
            tax: item.tax || TAX_TIERS[index % TAX_TIERS.length],
            geometry: item.geometry || {
                type: "Point",
                coordinates: [77.2090, 28.6139]
            }
        }));

        const inserted = await Listing.insertMany(preparedData);
        console.log(`Successfully seeded ${inserted.length} listings with categories and coordinates!`);
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

seedDB();

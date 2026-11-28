import { v2 as cloudinary } from "cloudinary";
import multerStoragePkg from "multer-storage-cloudinary";

const CloudinaryStorage = multerStoragePkg.CloudinaryStorage || multerStoragePkg;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// multer-storage-cloudinary expects an object with a .v2 property
cloudinary.v2 = cloudinary;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",
        allowed_formats: ["png", "jpg", "jpeg"],
    },
});

export { cloudinary, storage };

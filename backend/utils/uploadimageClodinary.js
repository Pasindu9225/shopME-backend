import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET_KEY,
});

const uploadImageClodinary = async (image) => {
  if (!image) {
    throw new Error("No image provided");
  }

  const buffer = image.buffer || Buffer.from(await image.arrayBuffer());

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "buyMe" }, (error, uploadResult) => {
        if (error) return reject(error);
        return resolve(uploadResult);
      })
      .end(buffer);
  });

  return uploadImage;
};

export default uploadImageClodinary;

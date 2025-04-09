import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const generateCloudinarySignature = (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "social-network";
  const uploadPreset = "jo7epcsq";

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}`;

  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + process.env.CLOUDINARY_API_SECRET) 
    .digest("hex");

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    uploadPreset,
  });
};

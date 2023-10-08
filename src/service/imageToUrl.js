const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { config } = require("dotenv");
const sharp = require("sharp");

config();

const s3 = new aws.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.S3_BUCKET_REGION,
});

const upload = () =>
  multer({
    storage: multerS3({
      s3: s3Config,
      bucket: "projectimagestorage1", // Replace with your S3 bucket name
      acl: "public-read", // Set appropriate access control
      key: function (req, file, cb) {
        cb(null, "images/" + Date.now() + "-" + file.originalname); // Specify the S3 object key
      },
    }),
  });
 const uploadBase64Image = async (imageBuffer) => {
  try {
    console.log(imageBuffer.length / (1024 * 1024));
   

    const objectKey = "images/my" + Date.now() + "Image.jpg";
    const bucketName = "projectimagestorage1";

    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: imageBuffer,
      ContentType: "image/jpeg", // Set the appropriate content type
    };

    // Upload the image buffer to S3
    const uploadResponse = await s3.upload(params).promise();
    

    // Construct the S3 URL for the uploaded image
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    console.log("Image uploaded successfully");

    return uploadResponse.Location;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
module.exports = uploadBase64Image;


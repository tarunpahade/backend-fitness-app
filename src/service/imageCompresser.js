// Import the required libraries
const sharp = require('sharp');
const { uploadImage } = require("../database/tasks");


function compressImage(base64,id){

  const maxWidth = 500;
  const maxHeight = 500;
  const quality = 80;

  // Create a buffer from the base64 image
  const buffer = Buffer.from(base64, 'base64');
  console.log(buffer);
  if (buffer.length === 0) {
    console.log('Image buffer is empty');
  } else {
   
    sharp(buffer)
    .resize(maxWidth, maxHeight)
    .jpeg({ quality: quality })
    .toBuffer()
    .then((compressedImage) => {
    
     console.log(compressedImage.length);
const task = uploadImage(compressedImage,id);
if (task){
  console.log('saved');
}

     
    })
    .catch((error) => console.error(error));

  }
 
}

module.exports={compressImage}
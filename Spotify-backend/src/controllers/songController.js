import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import songModel from '../models/songModel.js';

dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const addSong = async (req, res) => {
  try {
    console.log('req.files:', req.files);

    const name = req.body.name;
    const desc = req.body.desc;
    const album = req.body.album;

    if (!req.files || !req.files.audio || !req.files.image) {
      return res.status(400).send('Audio and image files are required.');
    }

    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    if (!audioFile || !imageFile) {
      return res.status(400).send('Audio and image files are required.');
    }

    const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: 'video' });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });

    console.log(name, desc, album, audioUpload, imageUpload);

    // Calculate duration (example: hardcoded for now, replace with actual logic)
    const duration = `${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`; // Example duration in seconds

    const song = new songModel({
      name,
      desc,
      album,
      duration,
      file: audioUpload.secure_url,
      image: imageUpload.secure_url,
    });

    await song.save();
    res.json({success:true,message:"Song Added"})

    // res.status(201).send('Song added successfully.');
  } catch (error) {
    console.error('Error adding song:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).send('Internal Server Error');
  }
};

const listSong = async (req, res) => {
  
try {
  const allSongs = await songModel.find({});
  res.json({success:true, songs: allSongs})
} catch (error) {
  console.log(error);
  res.json({success:false});
}

};

const removeSong = async(req,res) => {
try {

  await songModel.findByIdAndDelete(req.body.id);
  res.json({success:true, message:"Song removed"});
  
} catch (error) {
  console.log(error);
  res.json({success:false})
}
}

export  { addSong, listSong, removeSong }

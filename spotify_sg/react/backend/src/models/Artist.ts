import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  artist: String,
  artist_id: String,
  image_url: String,
});

export default mongoose.model('Artist', artistSchema);

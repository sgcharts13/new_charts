import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  title: String,
  track_id: String,
  artists: String,
  artist_ids: [String],
  peak_pos: Number,
  peak_streams: Number,
  weeks_on: Number,
  image_url: String,
});

export default mongoose.model('Track', trackSchema);

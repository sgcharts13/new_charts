import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  pos: Number,
  pos_change: String,
  streams: Number,
  streams_change: String,
  week_name: String,
  peak_pos: Number,
  peak_streams: Number,
  weeks_on: Number,
  track_id: String,
});

export default mongoose.model('Chart', chartSchema);

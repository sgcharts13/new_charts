import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import Chart from './models/Chart';
import Track from './models/Track';
import Artist from './models/Artist';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🛡️ Load credentials from .env
const user = encodeURIComponent(process.env.MONGO_USER as string);
const pass = encodeURIComponent(process.env.MONGO_PASS as string);
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

// 🔗 Build MongoDB URI
const uri = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

// 🗄️ Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 📘 Interfaces
interface ChartDoc {
  pos: number;
  pos_change: string;
  streams: number;
  streams_change: string;
  week_name: string;
  peak_pos: number;
  peak_streams: number;
  weeks_on: number;
  track_id: string;
}

interface TrackDoc {
  title: string;
  track_id: string;
  artists: string;
  artist_ids: string[];
  peak_pos: number;
  peak_streams: number;
  weeks_on: number;
  image_url: string;
  artist_objs?: ArtistDoc[]; // Optional for full chart data
}

interface ArtistDoc {
  artist: string;
  artist_id: string;
  image_url: string;
}

// 📆 Get all available week names
app.get('/weeks', async (_, res) => {
  try {
    const weeks = await Chart.distinct('week_name');
    res.json(weeks.sort().reverse());
  } catch (error) {
    console.error('Error fetching weeks:', error);
    res.status(500).json({ error: 'Failed to fetch weeks' });
  }
});

// 📊 Get full chart data for a selected week
app.get('/charts/:week', async (req, res) => {
  const week = req.params.week;

  try {
    // Step 1: Get chart entries
    const charts = await Chart.find({ week_name: week }).sort({ pos: 1 }).lean() as ChartDoc[];

    // Step 2: Get all track IDs from charts
    const trackIds = charts.map(c => c.track_id);

    // Step 3: Get track docs
    const tracks = await Track.find({ track_id: { $in: trackIds } }).lean() as TrackDoc[];

    // Step 4: Get all artist IDs
    const allArtistIds = tracks.flatMap(t => t.artist_ids);
    const artists = await Artist.find({ artist_id: { $in: allArtistIds } }).lean() as ArtistDoc[];

    // Step 5: Build lookup maps
    const artistMap = Object.fromEntries(artists.map(a => [a.artist_id, a]));
    const trackMap = Object.fromEntries(tracks.map(t => [
      t.track_id,
      { ...t, artist_objs: t.artist_ids.map(id => artistMap[id] || null) }
    ]));

    // Step 6: Combine full chart data
    const fullData = charts.map(chart => {
      const track = trackMap[chart.track_id] ?? null;
      return {
        ...chart,
        track,
      };
    });

    res.json(fullData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// 🚀 Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔊 Server running on http://localhost:${PORT}`);
});

export interface Artist {
  artist: string;
  artist_id: string;
  image_url: string;
}

export interface Track {
  image_url: string;
  title: string;
  track_id: string;
  artists: string;
  artist_ids: string[];
  peak_pos: number;
  peak_streams: number;
  weeks_on: number;
  artist_objs: Artist[];
}

export interface ChartEntry {
  pos: number;
  pos_change: string;
  streams: number;
  streams_change: string;
  week_name: string;
  peak_pos: number;
  peak_streams: number;
  weeks_on: number;
  track_id: string;
  track: Track;
}

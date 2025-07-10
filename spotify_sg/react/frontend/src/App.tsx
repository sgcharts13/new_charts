import { useEffect, useState } from 'react';
import axios from 'axios';
import type { ChartEntry } from './interfaces';
import './App.css';

function App() {
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [charts, setCharts] = useState<ChartEntry[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/weeks').then(res => {
      setWeeks(res.data);
      if (res.data.length > 0) setSelectedWeek(res.data[0]);
    });
  }, []);

  useEffect(() => {
  if (selectedWeek) {
    axios.get(`http://localhost:5000/charts/${encodeURIComponent(selectedWeek)}`).then(res => {
      setCharts(res.data);
    });
  }
}, [selectedWeek]);


  return (
    <div className="app">
      <header>
        <h1>Spotify SG Weekly Charts</h1>
        <select onChange={e => setSelectedWeek(e.target.value)} value={selectedWeek}>
          {weeks.map(week => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
      </header>

      <div className="chart-list">
        {charts.map((entry) => (
          <div className="chart-item" key={entry.track_id}>
            <div className="position">#{entry.pos}</div>
            <div className="change">{entry.pos_change}</div>
            <div className="track-info">
              <img src={'https://i.scdn.co/image/' + entry.track.image_url + ''} alt="artist" />
              <div>
                <strong>{entry.track.title}</strong><br />
                {entry.track.artists}
              </div>
            </div>
            <div className="streams">{entry.streams.toLocaleString()} streams</div>
            <div className="change">{entry.weeks_on} weeks</div>
            <div className="change">Peak: {entry.peak_pos}, {entry.peak_streams} Streams</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

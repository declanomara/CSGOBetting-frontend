import { useEffect, useState, useRef } from 'react';
import MatchGrid from './components/MatchGrid';
import './App.css';

const URL = "http://dserver:8000/matches";
const REFRESH_INTERVAL = 5000;

function App() {
  const [matches, setMatches] = useState([]);
  const currentDateRef = useRef(null);

  const fetchData = () => {
    // Get the timestamp from 12 hours ago
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 12);
    const timestamp = Math.floor(sixHoursAgo.getTime()/1000);
    fetch(URL + `?after=${timestamp}`)
      .then(response => response.json())
      .then(data => setMatches(data));
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const isCurrentDate = (date) => {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return date === currentDate;
  };

  const renderDateHeader = (date) => {
    return (
      <h2
        className="date-header"
        style={{ backgroundColor: '#222', color: '#fff', margin: 0 }}
      >
        {date}
      </h2>
    );
  };

  const groupedMatches = matches.reduce((acc, match) => {
    const date = new Date(match.time);
    const formattedDate = date.toString() !== 'Invalid Date' ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Date';
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(match);
    return acc;
  }, {});

  return (
    <div className="App" style={{ backgroundColor: '#222', paddingTop: 20}}>
      {Object.entries(groupedMatches).map(([date, matches]) => (
        <div key={date}>
          {renderDateHeader(date)}
          <MatchGrid matches={matches} />
        </div>
      ))}
    </div>
  );
}

export default App;

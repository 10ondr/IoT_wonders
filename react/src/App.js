import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";  
import MeetingRoom from './components/MeetingRoom';
import Tabs from './components/Tabs';

function App() {
  // Replace the following values with your own
  const roomName = 'your_room'; // Name of your room on meetingrooms.net
  const mapBoxAccessToken = 'your_token'; // Your access token on mapbox.com

  return (
    <div className="">
      <div style={{ width: '100%', height: '600px', resize: 'vertical', overflow: 'auto' }}>
        <MeetingRoom
          url={`https://go.meetingrooms.net/live/${roomName}/room1?auth=1`}
        />
      </div>
      <Tabs mapBoxAccessToken={mapBoxAccessToken} />
    </div>
  );
}

export default App;

import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";  
import Tabs from './components/Tabs'
import MeetingRoom from './components/MeetingRoom'

function App() {
  return (
    // <Tabs />
    <div className="">
      <div style={{ width: '100%', height: '600px', resize: 'vertical', overflow: 'auto' }}>
        <MeetingRoom
          url={'https://go.meetingrooms.net/live/your_room/room1?auth=1'}
        />
      </div>
      <Tabs />
    </div>
  );
}

export default App;

import React from 'react'; 
import { TabView, TabPanel } from 'primereact/tabview';
import RoomSettings from './RoomSettings';
import AgentControls from './AgentControls';

function Tabs() {
    return (
        <div className="card">
            <TabView renderActiveOnly={false}>
                <TabPanel header="Room Settings">
                    <RoomSettings />
                </TabPanel>
                <TabPanel header="Agent Controls">
                    <AgentControls />
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Tabs;
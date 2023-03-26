import React, { useState } from 'react'; 
import { TabView, TabPanel } from 'primereact/tabview';
import RoomSettings from './RoomSettings';
import AgentControls from './AgentControls';
import AgentStatus from './AgentStatus';
import AgentMap from './AgentMap';


const tabIndexMap = 2;
const mapRefObj = {};

function Tabs(props) {
    const [activeIndex, setActiveIndex] = useState(0);

    const setTabIndex = (index) => {
        setActiveIndex(index);
        if (index === tabIndexMap && mapRefObj.map) {
            setTimeout(() => {
                // Apply css height, otherwise a manual browser window resize is needed
                mapRefObj.map._onWindowResize();
            }, 500);
        }
    };

    return (
        <div className="card">
            <TabView renderActiveOnly={false}>
                <TabPanel header="Room Settings">
                    <RoomSettings />
                </TabPanel>
                <TabPanel header="defaultAgent">
                    <TabView activeIndex={activeIndex} renderActiveOnly={false} onTabChange={(e) => setTabIndex(e.index)}>
                        <TabPanel header="Agent Controls">
                            <AgentControls />
                        </TabPanel>
                        <TabPanel header="Agent Status">
                            <AgentStatus />
                        </TabPanel>
                        { props.mapBoxAccessToken ?
                        <TabPanel header="Agent Map">
                            <AgentMap
                                mapBoxAccessToken={props.mapBoxAccessToken}
                                mapRefObj={mapRefObj}
                            />
                        </TabPanel>
                        : null }
                    </TabView>
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Tabs;
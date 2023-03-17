import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { sendMessage, clearChat } from '../globalFunctions';


const sendRequest = async (url) => {
    try {
        return await axios.get(url);
    } catch (error) {
        console.log('sendRequest error: ', error);
    }
};


function Tabs() {
    const [speed, setSpeed] = useState(255);
    return (
        <div className="card">
            <TabView>
                <TabPanel header="agentDefault">
                    <div>
                        <Button
                            label="Webhook"
                            onClick={() => sendRequest('https://trigger.macrodroid.com/ea7ca43b-cb3c-49db-aca6-ccb723cc27e7/test') }
                        />
                        <Button
                            label="Clear chat"
                            onClick={() => clearChat() }
                        />
                        <Button
                            label="Switch camera"
                            onClick={() => sendMessage({ camera: 'toggle' }) }
                        />
                        <Button
                            label="←"
                            onClick={() => sendMessage({ ble: { msg: 'd:3:1' }}) }
                        />
                        <Button
                            label="→"
                            onClick={() => sendMessage({ ble: { msg: 'd:3:0' }}) }
                        />
                        <Button
                            label="↑"
                            onClick={() => {
                                setSpeed(speed + 20 > 255 ? 255 : speed + 20);
                                sendMessage({ ble: { msg: `pwm:1:${speed}` }});
                            }}
                        />
                        <Button
                            label="↓"
                            onClick={() => {
                                setSpeed(speed - 20 < 100 ? 100 : speed - 20);
                                sendMessage({ ble: { msg: `pwm:1:${speed}` }});
                            }}
                        />
                        <Button
                            label="LED ON"
                            onClick={() => sendMessage({ ble: { msg: 'pwm:0:255' }}) }
                        />
                        <Button
                            label="LED OFF"
                            onClick={() => sendMessage({ ble: { msg: 'pwm:0:0' }}) }
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <a href="https://web.airdroid.com/" target="_blank" rel="noreferrer nofollow">Remote Control</a>
                    </div>
                    {/* <a href='https://tinyurl.com/2lehbdly/test' target='_blank'>CLICK</a> */}
                </TabPanel>
                <TabPanel header="agent1">
                    <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                        eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                        ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
                <TabPanel header="agent2">
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                        quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                        culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
                        Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Tabs;
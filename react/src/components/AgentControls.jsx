import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { sendMessage, clearChat } from '../globalFunctions';

const sendRequest = async (url) => {
    try {
        return await axios.get(url);
    } catch (error) {
        console.log('sendRequest error: ', error);
    }
};

function AgentControls() {
    const [speed, setSpeed] = useState(255);
    return (
        <>
            <div className='settings-section'>
                <h3>Movement controls</h3>
                <div className='button-container'>
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
                </div>
            </div>
            <div className='settings-section'>
                <h3>Other controls</h3>
                <div className='button-container'>
                    <Button
                        label="Clear chat"
                        onClick={() => clearChat() }
                    />
                    <Button
                        label="Switch camera"
                        onClick={() => sendMessage({ camera: 'toggle' }) }
                    />
                    <Button
                        label="Camera ON"
                        onClick={() => sendMessage({ camera: 'on' }) }
                    />
                    <Button
                        label="Camera OFF"
                        onClick={() => sendMessage({ camera: 'off' }) }
                    />
                    <Button
                        label="Mic ON"
                        onClick={() => sendMessage({ mic: 'on' }) }
                    />
                    <Button
                        label="Mic OFF"
                        onClick={() => sendMessage({ mic: 'off' }) }
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
            </div>
            <div className='settings-section'>
                <h3>External</h3>
                <div className='button-container'>
                    <Button
                        label="Webhook"
                        onClick={() => sendRequest('https://trigger.macrodroid.com/ea7ca43b-cb3c-49db-aca6-ccb723cc27e7/test') }
                    />
                    <div style={{ marginTop: '20px' }}>
                        <a href="https://web.airdroid.com/" target="_blank" rel="noreferrer nofollow">Remote Control</a>
                    </div>
              </div>
            </div>
        </>
    )
}

export default AgentControls;
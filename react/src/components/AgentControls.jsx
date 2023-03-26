import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {
    sendMessage,
    clearChat,
    sendRequestHTTP,
} from '../globalFunctions';


let refreshIntervalRef = null;

const refreshIntervalOptions = [0, 15000, 30000, 60000, 120000, 300000, 600000, 1800000, 3600000];
const defaultRefreshInterval = 30000;

function AgentControls() {
    const [speed, setSpeed] = useState(255);
    const [refreshIntervalMsDropdown, setRefreshIntervalMsDropdown] = useState(defaultRefreshInterval);
    const [refreshIntervalMs, setrefreshIntervalMs] = useState(defaultRefreshInterval);

    const changeRefreshInterval = (milliseconds) => {
        if (milliseconds < 5000) {
            console.log('changeRefreshInterval milliseconds < 5000');
            return;
        }
        if (refreshIntervalRef) {
            clearInterval(refreshIntervalRef);
        }
        refreshIntervalRef = setInterval(() => {
            sendMessage({ sensors: { all: true } });
        }, milliseconds);
    };

    useEffect(() => {
        if (!refreshIntervalMs && refreshIntervalRef) {
            clearInterval(refreshIntervalRef);
        } else {
            changeRefreshInterval(refreshIntervalMs);
        }
    }, [refreshIntervalMs])

    useEffect(() => {
        /*** componentDidMount equivalent here ***/
        changeRefreshInterval(refreshIntervalMs);
        return () => {
            /*** componentWillUnmount equivalent here ***/
            if (refreshIntervalRef) {
                clearInterval(refreshIntervalRef);
            }
        };
    }, [])

    return (
        <>
            <div className='settings-section'>
                <h3>Movement controls</h3>
                <div className='flex-wrap-container'>
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
                <div className='flex-wrap-container'>
                    <Button
                        label="Clear chat"
                        onClick={() => clearChat() }
                    />
                    <Button
                        label="Get sensors"
                        onClick={() => sendMessage({ sensors: { all: true } }) }
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
                <h3>Status refresh controls</h3>
                <p>Current refresh interval: {refreshIntervalMs / 1000}s</p>
                <div className='flex-wrap-container'>
                    <Dropdown
                        value={refreshIntervalMsDropdown}
                        onChange={(e) => setRefreshIntervalMsDropdown(e.value)}
                        options={refreshIntervalOptions}
                        placeholder="Select interval [ms]"
                    />
                    <Button
                        label="Apply interval"
                        disabled={refreshIntervalMs === refreshIntervalMsDropdown}
                        onClick={() => setrefreshIntervalMs(refreshIntervalMsDropdown) }
                    />
                </div>
            </div>
            <div className='settings-section'>
                <h3>External</h3>
                <div className='flex-wrap-container'>
                    <Button
                        label="Webhook"
                        onClick={() => sendRequestHTTP('https://trigger.macrodroid.com/ea7ca43b-cb3c-49db-aca6-ccb723cc27e7/test', 'get') }
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
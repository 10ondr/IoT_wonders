import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { newSensorData } from '../redux/sensors';
import {
    setIframeRef,
    addReceivedMessageCallback,
} from '../globalFunctions';


function MeetingRoom(props) {
    const [removeNewMessageListenerFns, setRemoveNewMessageListenerFns] = useState([]);
    const [url, setUrl] = useState(props.url || 'https://go.meetingrooms.net/');
    const inputRef = useRef(null);

    const newMessageCallback = (message) => {
        console.log('New message received:', message);
        if (message.startsWith('SENSORS:')) {
            const parts = message.split('SENSORS:');
            if (parts.length < 2) {
                return;
            }
            const response = JSON.parse(parts[1]);
            const { timestamp, sensorData } = response;
            if (!timestamp || !sensorData) {
                return;
            }
            props.newSensorData(timestamp, sensorData);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            setIframeRef(inputRef.current);
        }
    }, [inputRef]);

    useEffect(() => {
        /*** componentDidMount equivalent here ***/
        const intervalRef = setInterval(() => {
            const result = addReceivedMessageCallback(newMessageCallback);
            if (typeof result === 'function') {
                // New message listener set successfully, returns a function to remove itself
                setRemoveNewMessageListenerFns([...removeNewMessageListenerFns, result]);
                if (intervalRef) {
                    clearInterval(intervalRef);
                }
            }
        }, 3000);
        return () => {
            /*** componentWillUnmount equivalent here ***/
            console.log('MeetingRoom componentWillUnmount - triggered');
            if (intervalRef) {
                console.log('MeetingRoom componentWillUnmount - clearing interval', intervalRef);
                clearInterval(intervalRef);
            }
            for (const removeListernerFn of removeNewMessageListenerFns) {
                console.log('MeetingRoom componentWillUnmount - removing new message listener');
                removeListernerFn();
            }
        };
    }, [])

    return (
        <div style={{ height: '100%', width: '98%' }}>
            <iframe
                id="video-iframe"
                ref={inputRef}
                src={url}
                height={"95%"}
                width={"100%"}
                title="description"
                allow="camera *; microphone *;autoplay"
                allowusermedia
            ></iframe>
        </div>
    )
}

const mapStateToProps = (state) => ({
    sensors: state.sensors,
});

export default connect(mapStateToProps, { newSensorData })(MeetingRoom);

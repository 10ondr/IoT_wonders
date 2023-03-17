import React, { useState, useEffect, useRef } from 'react';
import { setIframeRef } from '../globalFunctions';


function MeetingRoom(props) {
    const [url, setUrl] = useState(props.url || 'https://go.meetingrooms.net/');
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            setIframeRef(inputRef.current);
        }
    }, [inputRef.current]);
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

export default MeetingRoom;
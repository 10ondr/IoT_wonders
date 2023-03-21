import React, { useState } from 'react'; 
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {
    webrtc_getMediaServerUrl,
} from '../globalFunctions';

const defaultRoomConfig = {
    request: "create",
    room: 632021000040,
    description: "Room 632021000040",
    pin_required: false,
    max_publishers: 6,
    bitrate: 64000,
    bitrate_cap: true,
    fir_freq: 30,
    require_pvtid: false,
    require_e2ee: false,
    notify_joining: false,
    audiocodec: "opus",
    videocodec: "vp8",
    record: false,
    lock_record: false,
    audiolevel_ext: true,
    audiolevel_event: true,
    audio_active_packets: 50,
    audio_level_average: 40,
    videoorient_ext: false,
    playoutdelay_ext: true,
    transport_wide_cc_ext: true,
    permanent: true
};

const bitrateOptions = [64000, 128000, 256000, 512000, 1024000, 2048000];

const sendPostRequest = async (url, data) => {
    try {
        return await axios.post(url, data);
    } catch (error) {
        console.log('sendRequest error: ', error);
    }
};

const getNewSessionUrl = async (mediaUrl) => {
    const sessionReqData = {
        janus: "create",
        transaction: "Y5PuIoVxaT5j",
    };
    const sessionResp = await sendPostRequest(mediaUrl, sessionReqData);
    const sessionID = sessionResp?.data?.data?.id;
    if (!sessionID) {
        return;
    }
    const sessionReqData2 = {
        janus: "attach",
        plugin: "janus.plugin.videoroom",
        opaque_id: "videoroomtest-YDfCIHQh4qCb",
        transaction: "pvFZz9hjhqCI",
    };
    const sessionResp2 = await sendPostRequest(`${mediaUrl}/${sessionID}`, sessionReqData2);
    const sessionSubID = sessionResp2?.data?.data?.id;
    if (!sessionSubID) {
        return null;
    }
    return `${mediaUrl}/${sessionID}/${sessionSubID}`;
};

const getRoomInfo = async (sessionUrl, roomID) => {
    const data = {
        janus: "message",
        body: {
            request: "list",
        },
        transaction: "P0qsOHpCRLcZ",
    };
    const resp = await sendPostRequest(sessionUrl, data);
    return resp?.data?.plugindata?.data?.list?.find((room) => room.room === roomID);
};

const destroyRoom = async (sessionUrl, roomID) => {
    const data = {
        janus: "message",
        body: {
            request: "destroy",
            room: roomID,
            secret: "123456", // Some rooms I already created with this secret
            permanent: true,
        },
        transaction: "P0qsOHpCRLcZ",
    }
    const resp = await sendPostRequest(sessionUrl, data);
    const respData = resp?.data?.plugindata?.data;
    return respData?.videoroom === 'destroyed' && respData?.room === roomID;
};

const createRoom = async (sessionUrl, roomConfig) => {
    roomConfig = roomConfig ? roomConfig : defaultRoomConfig;
    const data = {
        janus: "message",
        body: roomConfig,
        transaction: "P0qsOHpCRLcZ"
    }
    const resp = await sendPostRequest(sessionUrl, data);
    const respData = resp?.data?.plugindata?.data;
    return respData?.videoroom === 'created' && respData?.room === roomConfig.room;
};

const editRoom = async (sessionUrl, roomConfig) => {
    if (!roomConfig) {
        return false;
    }
    const data = {
        janus: "message",
        body: roomConfig,
        transaction: "P0qsOHpCRLcZ"
    }
    const resp = await sendPostRequest(sessionUrl, data);
    const respData = resp?.data?.plugindata?.data;
    return respData?.videoroom === 'edited' && respData?.room === roomConfig.room;
};


function WebRTC() {
    const [roomID, setRoomID] = useState(defaultRoomConfig.room);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [sessionUrl, setSessionUrl] = useState(null);
    const [roomInfo, setRoomInfo] = useState(null);
    const [bitrate, setBitrate] = useState(bitrateOptions[0]);
    return (
        <div>
            <h2>WebRTC Settings</h2>
            <p>Media server URL: {mediaUrl || '<unknown>'}</p>
            <p>Session URL: {sessionUrl || '<unknown>'}</p>
            <p>Room info: {roomInfo || '<unknown>'}</p>
            <Button
                label="MediaServer get url"
                onClick={() => setMediaUrl(webrtc_getMediaServerUrl()) }
            />
            <Button
                label="MediaServer new session"
                onClick={() => getNewSessionUrl(mediaUrl).then((url) => setSessionUrl(url)) }
                disabled={!mediaUrl}
            />
            <Button
                label="Get room info"
                onClick={() => getRoomInfo(sessionUrl, roomID).then((roominfo) => setRoomInfo(JSON.stringify(roominfo, null, 2))) }
                disabled={!sessionUrl}
            />
            <Button
                label="Destroy room"
                onClick={() => destroyRoom(sessionUrl, roomID).then((success) => console.log(`Destroy room. Success: ${success}`)) }
                disabled={!sessionUrl || !roomID}
            />
            <Button
                label="Create room"
                onClick={() => createRoom(sessionUrl, defaultRoomConfig).then((success) => console.log(`Create room. Success: ${success}`)) }
                disabled={!sessionUrl}
            />
            <Dropdown
                value={bitrate}
                onChange={(e) => setBitrate(e.value)}
                options={bitrateOptions}
                // optionLabel="name"
                placeholder="Select bitrate"
                // className="w-full md:w-14rem"
            />
            <Button
                label="Apply bitrate"
                onClick={() => editRoom(sessionUrl, {
                    request: "edit",
                    room: roomID,
                    permanent: true,
                    new_bitrate: bitrate,
                }).then((success) => console.log(`Edited room. Success: ${success}`)) }
                disabled={!sessionUrl}
            />
        </div>
    )
}

export default WebRTC;
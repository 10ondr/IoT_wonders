import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import AgentStatusChart from './AgentStatusChart';
import {
    msToDate,
} from '../globalFunctions';


const chartLineColors = ['red', 'green', 'blue', 'purple', 'orange', 'yellow'];

const sensorNameMap = {
    battery: 'Battery',
    battery_level: 'Battery level',
    battery_charging: 'Battery charging status',
    battery_chargingTime: 'Battery time until charged',
    battery_dischargingTime: 'Battery time until discharged',
    location: 'Location',
    screen: 'Screen',
    accelerometer: 'Accelerometer',
    linearAcceleration: 'Linear acceleration',
    absoluteOrientation: 'Absolute orientation',
    relativeOrientation: 'Relative orientation',
    magnetometer: 'Magnetometer',
    ambientLight: 'Ambient light',
    gravity: 'Gravity',
    gyroscope: 'Gyroscope',
};

// statusData status is not updated in the callback, so this variable is being used for reference
let _statusData = {};

const prettySensorName = (sensorName) => {
    return `${sensorNameMap[sensorName]}`;
};

const scrollOnElement = (elementId) => {
    document.getElementById(elementId)?.scrollIntoView();
};

// Some values from a single sensor should have individual charts
const unpackSensorData = (sensorData) => {
    if (sensorData['battery']) {
        if (sensorData['battery'].data?.['level'] !== undefined) {
            sensorData['battery_level'] = { status: 'OK', data: { level: sensorData['battery'].data['level'] }};
        }
        if (sensorData['battery'].data?.['charging'] !== undefined) {
            sensorData['battery_charging'] = { status: 'OK', data: { charging: Number(sensorData['battery'].data['charging']) }};
        }
        if (sensorData['battery'].data?.['chargingTime'] !== undefined) {
            sensorData['battery_chargingTime'] = { status: 'OK', data: { chargingTime: sensorData['battery'].data['chargingTime'] }};
        }
        if (sensorData['battery'].data?.['dischargingTime'] !== undefined) {
            sensorData['battery_dischargingTime'] = { status: 'OK', data: { dischargingTime: sensorData['battery'].data['dischargingTime'] }};
        }
        delete sensorData['battery'];
    }
    if (sensorData['location']) {
        delete sensorData['location']; // Not suitable for charts
    }
    if (sensorData['screen']) {
        delete sensorData['screen']; // Not suitable for charts
    }
    return sensorData;
};

function AgentStatus(props) {
    const [statusData, setStatusData] = useState({});
    const [statusDataRaw, setStatusDataRaw] = useState(null);

    const parseRefreshedData = (newData) => {
        const { timestamp, sensorData } = newData;
        if (!timestamp || !sensorData) {
            return;
        }
        const unpackedSensorData = unpackSensorData(JSON.parse(JSON.stringify(sensorData)));
        const statusKeysToRefresh = [];
        const newStatusData = { ..._statusData };
        setStatusDataRaw({ timestamp, sensorData: unpackedSensorData });
        for (const sensorName of Object.keys(unpackedSensorData)) {
            const sensorValue = unpackedSensorData[sensorName];
            if (sensorValue.status !== 'OK') {
                continue;
            }
            statusKeysToRefresh.push(sensorName);
            newStatusData[sensorName] = newStatusData[sensorName] ? newStatusData[sensorName] : { labels: [], datasets: [] };
            newStatusData[sensorName].labels.push(timestamp);
            for (const key of Object.keys(sensorValue.data)) {
                const dataset = newStatusData[sensorName].datasets.find((obj) => obj.label === key);
                if (dataset && dataset.data) {
                    dataset.data.push(sensorValue.data[key]);
                } else {
                    const numOfDatasets = newStatusData[sensorName].datasets.length;
                    const newDataSet = {
                        label: key,
                        data: [sensorValue.data[key]],
                        fill: false,
                        tension: 0.2,
                        borderColor: numOfDatasets < chartLineColors.length ? chartLineColors[numOfDatasets] : 'black',
                    };
                    newStatusData[sensorName].datasets.push(newDataSet);
                }
            }
        }
        for (const key of statusKeysToRefresh) {
            // Needed to construct a new object to notify the component about the change
            newStatusData[key] = { ...newStatusData[key] };
        }
        _statusData = newStatusData;
        setStatusData({ ...newStatusData });
    };

    useEffect(() => {
        parseRefreshedData(props.sensors);
    }, [props.sensors])

    return (
        <div className="card">
            { statusDataRaw ?
            <>
                <h3>Latest status data:</h3>
                <div className='text-container' style={{ paddingBottom: '10px', paddingLeft: '30px' }}>
                    <p className='text-title'>Timestamp:&nbsp;</p>
                    <p>{`${msToDate(statusDataRaw.timestamp)}   [Epoch ms: ${statusDataRaw.timestamp}]` || '<unknown>'}</p>
                </div>
                <div className='flex-wrap-container' style={{ maxWidth: '90%' }}>
                { Object.keys(statusDataRaw.sensorData).map((sensorName) => {
                    return (
                        <div key={`stat_${sensorName}`} style={{ padding: '10px 30px 10px 30px' }}>
                            <p className='text-title' style={{ marginBottom: '5px', cursor: 'pointer' }} onClick={() => scrollOnElement(sensorName)}>
                                {`${prettySensorName(sensorName)}`}{statusDataRaw.sensorData[sensorName].status !== 'OK' ? `(status: ${statusDataRaw.sensorData[sensorName].status || '<unknown>'})` : null}:
                            </p>
                            { Object.keys(statusDataRaw.sensorData[sensorName].data).map((key) => {
                                return (
                                <div key={`stat_${sensorName}_${key}`} className='text-container'>
                                    <p className='text-titlee'>{key}:&nbsp;</p>
                                    <p>{statusDataRaw.sensorData[sensorName].data[key]}</p>
                                </div>
                                );
                            }) }
                        </div>
                    );
                }) }
                </div>
            </>
            : null}

            { Object.keys(statusData).map((sensorName) => {
                return (
                    <div key={sensorName} id={sensorName} style={{ paddingTop: '60px'}}>
                        <h3>{prettySensorName(sensorName)}</h3>
                        <AgentStatusChart data={statusData[sensorName]} />
                    </div>
                );
            }) }
        </div>
    );
}

const mapStateToProps = (state) => ({
    sensors: state.sensors,
});

export default connect(mapStateToProps, {})(AgentStatus);

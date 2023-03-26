import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Button } from 'primereact/button';


const agentRouteName = 'agentRoute';

const getGeoJson = (coordinates) => {
    return {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates,
        }
    }
};

function AgentMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(14.4831);
    const [lat, setLat] = useState(50.0297);
    const [zoom, setZoom] = useState(14);

    const centerOnRoute = () => {
        const firstCoordinate = map.current.getSource(agentRouteName)._data?.geometry?.coordinates?.[0];
        if (firstCoordinate) {
            map.current.setCenter(firstCoordinate);
            map.current.setZoom(14);
        }
    };

    const addSource = () => {
        map.current.addSource(agentRouteName, {
            type: 'geojson',
            data: getGeoJson([]),
        });
    };

    const modifySource = (coordinates) => {
        map.current.getSource(agentRouteName)?.setData(getGeoJson(coordinates));
    }

    const addLayer = () => {
        map.current.addLayer({
            id: agentRouteName,
            type: 'line',
            source: agentRouteName,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': 'red',
                'line-width': 8
            }
        });
    };

    const removeSource = () => {
        map.current.removeSource(agentRouteName);
    }

    const removeLayer = () => {
        map.current.removeLayer(agentRouteName);
    }
    
    useEffect(() => {
        /*** componentDidMount equivalent here ***/
        mapboxgl.accessToken = props.mapBoxAccessToken;
        if (map.current) {
            return; // initialize map only once
        }
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
        });
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
        setTimeout(() => {
            addSource();
            addLayer();
        }, 2000);
        if (props.mapRefObj) {
            props.mapRefObj.map = map.current;
        }
        console.log('Agent Map reference', map.current);
        return () => {
            /*** componentWillUnmount equivalent here ***/
            try {
                removeLayer();
                removeSource();
            } catch (error) {

            }
        };
    }, [])
    
    useEffect(() => {
        if (props.sensors.savedData.length < 1) {
            return;
        }
        const newCoordinates = props.sensors.savedData
            .filter((data) => data.sensorData['location'].status === 'OK')
            .map((data) => [data.sensorData['location'].data.longitude, data.sensorData['location'].data.latitude]);
        modifySource(newCoordinates);
    }, [props.sensors])

    return (
        <div>
            <Button
                label="Recenter"
                onClick={() => centerOnRoute()}
            />
            <div className="map-sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

const mapStateToProps = (state) => ({
    sensors: state.sensors,
});

export default connect(mapStateToProps, {})(AgentMap);

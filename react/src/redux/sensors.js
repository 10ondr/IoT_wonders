const initialState = {
  savedData: [],
  timestamp: null,
  sensorData: null,
};

export const sensorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_SENSOR_DATA': {
      return {
        savedData: [...state.savedData, { 
          timestamp: action.payload.timestamp,
          sensorData: action.payload.sensorData,
        }],
        timestamp: action.payload.timestamp,
        sensorData: action.payload.sensorData,
      };
    }
    case 'CLEAR_SENSOR_DATA': {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};

export const newSensorData = (timestamp, sensorData) => async (dispatch) => {
  dispatch({
    type: 'NEW_SENSOR_DATA',
    payload: {
      timestamp,
      sensorData,
    }
  })
};

export const clearSensorData = () => async (dispatch) => {
  dispatch({
    type: 'CLEAR_SENSOR_DATA',
  })
};

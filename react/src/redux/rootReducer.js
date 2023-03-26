import { combineReducers } from 'redux';
import { sensorsReducer } from './sensors';

const rootReducer = combineReducers({
  sensors: sensorsReducer,
})

export default rootReducer;

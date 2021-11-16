import {combineReducers} from 'redux';
import userReducer from './user_reducer';

const mainReducer = combineReducers({
    'user':userReducer,
})
export default mainReducer
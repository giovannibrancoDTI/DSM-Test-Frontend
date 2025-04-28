import { combineReducers } from "redux";
import albumReducer from "./slices/albumSlice"; 
import photoReducer from "./slices/photoSlice";

const rootReducer = combineReducers({
  albums: albumReducer,
  photos: photoReducer,
});

export default rootReducer;

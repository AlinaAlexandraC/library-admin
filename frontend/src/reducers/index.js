import { combineReducers } from "redux";

const placeholderReducer = (state = {}, action) => {
    return state;
};

export default combineReducers({
    placeholder: placeholderReducer,
});
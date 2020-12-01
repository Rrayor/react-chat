import {
    CHANNEL_CREATE_SUCCESS,
    CHANNEL_CREATE_FAIL,
    CHANNEL_GET_SUCCESS,
    CHANNEL_GET_FAIL,
    CHANNEL_GET_ONE_SUCCESS,
    CHANNEL_GET_ONE_FAIL
} from '../actions/types';

const initialState = {
    channels: [],
    selectedChannel: null,
    loading: true
};

export default function(state = initialState, action){
    const { type, payload } = action;

    switch(type){
        case CHANNEL_CREATE_SUCCESS:
            return  {
                ...state,
                selectedChannel: payload,
                loading: false
            };
        case CHANNEL_CREATE_FAIL:
            return {
                ...state,
                selectedChannel: null,
                loading: false
            };
        case CHANNEL_GET_SUCCESS:
            return {
                ...state,
                channels: payload,
                loading: false
            };
        case CHANNEL_GET_FAIL:
            return {
                ...state,
                channels: [],
                loading: false
            };
        case CHANNEL_GET_ONE_SUCCESS:
            return  {
                ...state,
                selectedChannel: payload,
                loading: false
            };
        case CHANNEL_GET_ONE_FAIL:
            return {
                ...state,
                selectedChannel: null,
                loading: false
            }
        default:
            return state;
    }
}
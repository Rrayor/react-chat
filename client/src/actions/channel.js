import axios from  'axios';
import {
    CHANNEL_GET_SUCCESS,
    CHANNEL_GET_FAIL,
    CHANNEL_CREATE_SUCCESS,
    CHANNEL_CREATE_FAIL,
    CHANNEL_GET_ONE_SUCCESS,
    CHANNEL_GET_ONE_FAIL
} from './types';

//Get list of channels
export const getChannels = type => async dispatch => {
    try{
        const res = await axios.get('/api/channel');

        dispatch({
            type: CHANNEL_GET_SUCCESS,
            payload: res.data
        });
    }catch(error){
        const errors = error.data.errors;

        if (errors) {
            errors.forEach(error => console.error(error.msg));
        }

        dispatch({
            type: CHANNEL_GET_FAIL
        });
    }
};

export const getChannel =  id => async dispatch => {
    try {
        const res  = await axios.get('/api/channel/' + id);


        dispatch({
            type: CHANNEL_GET_ONE_SUCCESS,
            payload: res.data
        });
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(error => console.error(error.msg));
        }

        dispatch({
            type: CHANNEL_GET_ONE_FAIL
        });
    }
};

//Create Channel
export const createChannel = ({ name, type }) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ name, type });
    
    try {
        const res = await axios.post('/api/channel', body, config);

        dispatch({
            type: CHANNEL_CREATE_SUCCESS,
            payload: res.data
        });

        dispatch(getChannels('Joined'));
    } catch (error) {
        const errors = error.data.errors;

        if (errors) {
            errors.forEach(error => console.error(error.msg));
        }

        dispatch({
            type: CHANNEL_CREATE_FAIL
        });
    }
};
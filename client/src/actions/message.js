import io from 'socket.io-client';
import {
    MESSAGE_SENT_SUCCESS,
    MESSAGE_SENT_FAIL
} from './types';

export const sendMessage = message => async dispatch => {
    try {
        
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(error => console.error(error.msg));
        }

        dispatch({
            type: MESSAGE_SENT_FAIL
        });
    }
}
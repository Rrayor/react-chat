import React from 'react';

const MessageForm = () => {
    return (
        <div>
            <form>
                <textarea name="message" id="message" cols="30" rows="2"></textarea>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default MessageForm;

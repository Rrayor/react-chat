import React from 'react';
import { Link } from 'react-router-dom';
import MessageForm from './MessageForm';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Messages = ({ selectedChannel }) => {
    if(selectedChannel){ 
        return (
            <section className="messages">
                <h1>{selectedChannel ? selectedChannel.name : 'Messages'}</h1>
                <Link to="/dashboard/settings">
                    <button>Settings</button>
                </Link>
                <ul className="message-list">
                {
                    selectedChannel.messages &&  selectedChannel.messages.length ?
                    (
                        selectedChannel.messages.map(message => {
                        return (<li key={message._id}>{ message.user }: { message.message } ({ message.sentDate })</li>);
                        })
                    ) :
                    (<h2>No messages Found</h2>)
                }
                </ul>
                <MessageForm />
            </section>
        );
    }else{
        return (
            <section className="messages">
                <h1>Messages</h1>
                <h2>No messages found</h2>
            </section>
        );
    }
}

Messages.propTypes = {
    selectedChannel: PropTypes.object
}

const mapStateToProps = state => ({
    selectedChannel: state.channel.selectedChannel
});

export default connect(mapStateToProps)(Messages);

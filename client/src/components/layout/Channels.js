import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannel, getChannels } from '../../actions/channel';

const Channels = ({ channel: { channels, loading }, getChannel, getChannels }) => {
    const changeType = async type => getChannels(type);
    const channelSelected = async id => getChannel(id);

    useEffect(() => {
        changeType('All');
    }, []);
    
    return (
        <Fragment>
            <button onClick={ event =>  changeType('All') }>All</button>
            <button onClick={ event => changeType('Joined') }>Joined</button>
            <ul className="channel-list">
                { !loading && channels.length ? channels.map(channel => <li key={ channel.id } onClick={ event => channelSelected(channel.id)}>{ channel.name }</li>) : <h3>No Channels Found</h3> }
            </ul>
            <Link to="/dashboard/create-channel">
                <button>Add Channel</button>
            </Link>
        </Fragment>
    );
}

Channels.propTypes = {
    getChannel: PropTypes.func.isRequired,
    getChannels: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    channel: state.channel
});

export default connect(mapStateToProps, { getChannel, getChannels })(Channels);

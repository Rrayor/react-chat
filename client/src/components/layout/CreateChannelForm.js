import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { createChannel } from '../../actions/channel';
import PropTypes from 'prop-types';

const CreateChannelForm = ({ createChannel }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'blacklist'
    });

    const { name, type } = formData;

    const onChange = event => setFormData({ ...formData, [event.target.name]: event.target.value });
    const onSubmit = async event => {
        event.preventDefault();
        createChannel({ name, type });
        setFormData({ ...formData, 'name': '' });
    };

    return (
        <Fragment>
            <form onSubmit={ event => onSubmit(event) }>
                <div className="form-group">
                    <input type="text" name="name" id="name" onChange={ event => onChange(event) } value={ name }/>
                    <button type="submit">Add Channel</button>
                </div>
            </form>
        </Fragment>
    );
}

CreateChannelForm.propTypes = {
    createChannel: PropTypes.func.isRequired
}

export default connect(null, { createChannel })(CreateChannelForm);

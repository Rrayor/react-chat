import React, {Fragment} from 'react';
import { Route, Switch } from 'react-router-dom';
import Channels from './Channels';
import Messages from './Messages';
import Settings from './Settings';
import CreateChannelForm from './CreateChannelForm';

const Dashboard = () => {
    return (
        <Fragment>
            <h1>Dashboard</h1>
            <div className="grid">
                <section className="left">
                    <Channels />
                </section>
                <section className="main">
                    <Switch>
                        <Route exact path="/dashboard/messages" component={ Messages } />
                        <Route exact path="/dashboard/settings" component={ Settings } />
                        <Route exact path="/dashboard/create-channel" component={ CreateChannelForm } />
                    </Switch>
                </section>
            </div>
        </Fragment>
    );
}

export default Dashboard;

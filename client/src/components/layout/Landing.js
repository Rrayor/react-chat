import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <section className="Landing">
            <h1>Welcome</h1>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </section>
    );
}

export default Landing;

import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { Input, Button, Loader, Dimmer, Icon } from 'semantic-ui-react'

const Login = () => {
    const [values, updateValues] = useState({
        username: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [maskPassword, toggleMask] = useState(true);
    const { push } = useHistory();

    const handleChanges = event => {
        updateValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault();
        let fieldsEmpty = false;
        Object.values(values).forEach(value => {
            if (value.length <= 0) fieldsEmpty = true;
        })
        if (!fieldsEmpty) {
            setLoading(true);
            setError("");
            await axios.post("http://localhost:4000/api/login", values)
            .then(response => {
                console.log(localStorage.getItem('token'));
                localStorage.setItem('token', JSON.stringify(response.data.token));
                push("/users");
            })
            .catch(error => {
                console.log(error.response.data.error);
                setError(error.response.data.error);
            });
            setLoading(false);
        }
        else setError("Both fields are required.")
    }

    return (
        <div className="Login window">
            {loading && <div>
                <Dimmer active inverted>
                <Loader size='medium'>Loading</Loader>
                </Dimmer>
            </div>}
            <h1>Users App</h1>
            <form onSubmit={handleSubmit}>
                <div className="input"><Input placeholder="Username" onChange={handleChanges} name="username"/></div>
                <div className="input">
                        {maskPassword ?
                        <Icon name="eye slash" size="large" onClick={() => toggleMask(false)} /> :
                        <Icon name="eye" size="large" onClick={() => toggleMask(true)} />}
                    <Input placeholder="Password" onChange={handleChanges} name="password" type={maskPassword ? "password" : "text"} /></div>
                <Button primary>Login</Button>
            </form>
            <div className="error">{error}</div>
            <div>Don't have an account? <Link to="/register">Sign up!</Link></div>
        </div>
    )
}

export default Login

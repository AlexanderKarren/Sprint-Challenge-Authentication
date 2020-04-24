import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from '../utils/axiosWithAuth'
import { Input, Button, Loader, Dimmer, Icon, Dropdown } from 'semantic-ui-react'

const departments = [
    {
        key: 'Finance',
        text: 'Finance',
        value: 'finance',
    },
    {
        key: 'Media',
        text: 'Media',
        value: 'media',
    },
]

const Register = () => {
    const [values, updateValues] = useState({
        username: "",
        department: "",
        password: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [maskPassword, toggleMask] = useState(true);
    const { push } = useHistory();

    const handleChanges = (event, data) => {
        console.log(values);
        updateValues({
            ...values,
            [data.name]: data.value
        })
   
    }

    const handleSubmit = async event => {
        event.preventDefault();
        console.log(values)
        if (values.password === values.confirmPassword) {
            setLoading(true);
            setError("");
            await axios.post("http://localhost:4000/api/register", {
                username: values.username,
                department: values.department,
                password: values.password
            })
            .then(response => {
                console.log(response);
                push("/");
            })
            .catch(error => {
                console.log(error.response.data.error);
                setError(error.response.data.error);
            });
            setLoading(false);
        }
        else {
            setError("Passwords do not match");
        }
    }

    return (
        <div className="Login window">
            {loading && <div>
                <Dimmer active inverted>
                <Loader size='medium'>Loading</Loader>
                </Dimmer>
            </div>}
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <div className="input"><Input placeholder="Username" onChange={handleChanges} name="username"/></div>
                <Dropdown
                onChange={handleChanges}
                name="department"
                placeholder="Department"
                fluid
                selection
                options={departments}
                />
                <div className="input">
                        {maskPassword ?
                        <Icon name="eye slash" size="large" onClick={() => toggleMask(false)} /> :
                        <Icon name="eye" size="large" onClick={() => toggleMask(true)} />}
                    <Input placeholder="Password" onChange={handleChanges} name="password" type={maskPassword ? "password" : "text"} />
                </div>
                <div className="input">
                        {maskPassword ?
                        <Icon name="eye slash" size="large" onClick={() => toggleMask(false)} /> :
                        <Icon name="eye" size="large" onClick={() => toggleMask(true)} />}
                    <Input placeholder="Confirm Password" onChange={handleChanges} name="confirmPassword" type={maskPassword ? "password" : "text"} />
                </div>
                <Button primary>Register</Button>
            </form>
            <div className="error">{error}</div>
            <div>Already have an account? <Link to="/">Log In</Link></div>
        </div>
    )
}

export default Register

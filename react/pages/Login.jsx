import React, { useState } from 'react';
import useLogin from '../hooks/useLogin';
import validation from '../validation'; // Adjust the path to where your validation file is located

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            validation.checkEmail(email);
            validation.checkLoginPassword(password); 
            await login(email, password);
        } catch (e) {
            setFormError(e);
        }
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Login</h3>
            <label htmlFor="email">Email:</label>
            <input
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label htmlFor="password">Password:</label>
            <input
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button disabled={isLoading} type="submit">Login</button>
            {formError && <div className='error'>{formError}</div>}
            {error && <div className='error'>{error}</div>}
        </form>
    );
}

export default Login;

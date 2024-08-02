import { useState } from 'react';
import useSignUp from '../hooks/useSignUp';
import validation from '../validation.js'; // Adjust the path to where your validation file is located

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { signup, error, isLoading } = useSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            validation.checkAdpEmail(email);
            validation.checkPassword(password, confirmPassword);
            await signup(email, password);
        } catch (e) {
            setFormError(e);
        }
    };

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            <label>Email:</label>
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password:</label>
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <label>Confirm Password:</label>
            <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
            />
            <button disabled={isLoading} type="submit">Sign Up</button>
            {formError && <div className='error'>{formError}</div>}
            {error && <div className='error'>{error}</div>}
        </form>
    );
};

export default SignUp;

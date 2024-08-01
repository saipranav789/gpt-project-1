import { useState , useEffect } from 'react';
import useSignUp from '../hooks/useSignUp'

const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {signup , error ,isLoading} = useSignUp()

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("email:",email,"password:", password)
        await signup(email,password)
    };

    return (
       
            <form className="signup" onSubmit={handleSubmit}>
                <h3>Sign Up</h3>
                <label>Email:</label>
                <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email} />
                <label>Password:</label>
                <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} />
                <button disabled={isLoading} type="submit">Sign Up</button>
                {error&& <div className='error'>{error}</div>}
            </form>
      
    );
};
    


export default SignUp
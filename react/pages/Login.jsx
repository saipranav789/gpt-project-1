import React ,{useState, useEffect} from 'react'
import useLogin from '../hooks/useLogin'

const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {login,error,isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("email:",email,"password:", password)
        await login(email,password)
    };

    return (
       
            <form className="login" onSubmit={handleSubmit}>
                <h3>Login</h3>
                <label>Email:</label>
                <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email} />
                <label>Password:</label>
                <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} />
                <button disabled={isLoading} type="submit">Login</button>
                {error&& <div className='error'>{error}</div>}
            </form>
      
    );
}

export default Login
import React ,{useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'
import { AuthContext } from '../../context/AuthContext'


const NavBar = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const {logout} = useLogout()
    const handleClick =()=>{
        logout()
        navigate('/');
    }
return (
    <header>
            <div className='container'>   
                    <nav>
                            
                            <div>
                                    {!user ? (
                                            <>
                                                    <Link to="/login">Login</Link>
                                                    <Link to="signup">Sign Up</Link>
                                            </>
                                    ) : <><Link onClick={handleClick}>Log Out</Link></>}
                                    
                                    <Link to="/"><h4>The Bulletin</h4></Link>

                            </div>
                    </nav>
            </div>
    </header>
)
}

export default NavBar
import {useState} from "react";
import {useNavigate,Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function Login(){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username,password);
            navigate('/notes');
        } catch {
            setError("Wrong Username or Passwordd");
        }
    };

    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Login</button>
            <Link to="/register">Create Account</Link>
        </form>
    
    );
}

export default Login;
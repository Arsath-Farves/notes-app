import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import api from "../api/axios";

function Register(){
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('register/',{username,email,password});
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            setError(data ? JSON.stringify(data):"Could not register");
            
        }
    };

   

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Create Account</button>
            <Link to="/login">Already have an account? Login</Link>
        </form>
        

    );
}

export default Register;
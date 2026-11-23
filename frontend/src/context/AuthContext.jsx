import  {createContext, useContext, useState} from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [isLoggedIn,setIsLoggedIn] = useState(!!localStorage.getItem('access'));

    const login = async (username,password) => {
        const {data} = await api.post('token/',{username,password});
        localStorage.setItem('access',data.access);
        localStorage.setItem('refresh',data.refresh);
        setIsLoggedIn(true);
        
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return(
        <AuthContext.Provider value={{isLoggedIn,login,logout}}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
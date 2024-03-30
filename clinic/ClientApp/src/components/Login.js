import React, { useState, useContext } from 'react';
import { login } from '../services/loginService';
import UserContext from './UserContext'; // Import UserContext

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUserRole, setIsAuthenticated } = useContext(UserContext); // Access setUserRole and setIsAuthenticated from context
    const [loginError, setLoginError] = useState(''); // State for login error message
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await login({ Username: username, Password: password });
            
            if (user) {
                const userRoleInt = parseInt(user.role, 10); // Convert role to integer
                console.log("Login successful, user role:", userRoleInt); // Debug log
                setUserRole(userRoleInt); // Update role in context
                setIsAuthenticated(true); // Set isAuthenticated to true
                setUsername(user.username);

                localStorage.setItem('isAuthenticated', true);

                localStorage.setItem('userRole', userRoleInt);
                
                localStorage.setItem('username', user.username);
                  
            }
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Incorrect username or password.'); // Set error message

        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                />
                <button type="submit">Login</button>
            </form>
            {loginError && <div className="login-error">{loginError}</div>} {/* Display error message */}
        </div>
    );
}

export default Login;

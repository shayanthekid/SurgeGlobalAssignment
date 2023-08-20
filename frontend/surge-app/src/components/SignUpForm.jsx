import  { useState } from 'react';
import { useEffect } from 'react';

import { useSignIn } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { loadCaptchaEnginge, LoadCanvasTemplate,  validateCaptcha } from 'react-simple-captcha';



const SignUpForm = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    const signIn = useSignIn()
    const navigate = useNavigate(); // Get the navigate function

    useEffect(() => {
        loadCaptchaEnginge(6);
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
     
        let userCaptchaValue = document.getElementById('user_captcha_input').value;

        if (validateCaptcha(userCaptchaValue)) {
            // Create a user object with the form data
            const user = {
                username,
                email,
                password,
            };

            try {
                const response = await fetch('http://localhost:5000/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                if (response.ok) {
                    const responseData = await response.json(); // Parse response JSON
                    console.log('User registered successfully');
                    if (
                        signIn({
                            token: responseData.token,
                            expiresIn: responseData.expiresIn,
                            tokenType: "Bearer",
                            authState: responseData.authUserState,

                        })
                    ) {
                        // Redirect or do-something
                        console.log("Successful");
                        navigate('/home'); // Use navigate function to redirect

                    } else {
                        // Handle sign-in error
                    }
                    // You can handle successful registration here, such as redirecting the user
                } else {
                    console.error('User registration failed');
                    // You can handle registration failure here, such as displaying an error message
                }
            } catch (error) {
                console.error('Error registering user:', error);
            }
        } else {
            alert('Captcha Does Not Match');
            document.getElementById('user_captcha_input').value = '';
        }


    
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl mb-4 font-semibold">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="w-full p-2 border rounded shadow-sm focus:outline-none focus:border-indigo-500"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full p-2 border rounded shadow-sm focus:outline-none focus:border-indigo-500"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="w-full p-2 border rounded shadow-sm focus:outline-none focus:border-indigo-500"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8} // Minimum password length
                        pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$" // Password pattern
                        title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
                    />
                    <p className="text-xs text-gray-600 mt-1">
                        Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
                    </p>
                </div> 
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Captcha
                    </label>
                    <input
                        className="w-full p-2 border rounded shadow-sm focus:outline-none focus:border-indigo-500"
                        placeholder="Enter Captcha Value"
                        id="user_captcha_input"
                        name="user_captcha_input"
                        type="text"
                    />
                </div>
                <div>
                    <LoadCanvasTemplate />
                </div>
                <button
                    className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;

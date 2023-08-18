import React, { useState } from 'react';
import { useSignIn } from 'react-auth-kit'

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = useSignIn()

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                console.log(responseData);
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
                    />
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

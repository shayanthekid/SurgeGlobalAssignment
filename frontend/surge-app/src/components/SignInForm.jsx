import { useState } from 'react';
import {
    useSignIn
} from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = useSignIn()
    const navigate = useNavigate(); // Get the navigate function

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create user data object
        const userData = {
            email,
            password,
        };

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Login successful:', responseData);
                // Handle successful login here, e.g. redirect user or update state
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
            } else {
                console.error('Login failed');
                // Handle login failure here, e.g. display an error message
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl mb-4 font-semibold">Sign In</h2>
            <form onSubmit={handleSubmit}>
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
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default SignInForm;

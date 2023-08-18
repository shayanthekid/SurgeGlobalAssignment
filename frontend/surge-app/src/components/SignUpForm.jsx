import React, { useState } from 'react';

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Implement your signup logic here, e.g. send data to backend
        const userData = {
            username,
            email,
            password,
        };

        console.log('User Data:', userData);
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

import React, { useState } from 'react';
import AuthTabs from '../components/AuthTabs';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import { useAuthUser } from 'react-auth-kit'

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('signin');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    const auth = useAuthUser()

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <div className="flex flex-col h-full"> {/* Wrap the form and footer */}
                    <div className="flex-grow">
                        <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
                        {activeTab === 'signin' ? <SignInForm /> : <SignUpForm />}
                    </div>
                    <footer className="text-center p-4">
                        <div className="text-lg font-semibold">Surge SE Internship March 2023</div>
                        {/* <div className="mt-1 text-gray-600">Sajid Fayaz Haniff  {auth().username}</div> */}
                        <div className="mt-1 text-gray-600">Sajid Fayaz Haniff  {auth().username}</div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

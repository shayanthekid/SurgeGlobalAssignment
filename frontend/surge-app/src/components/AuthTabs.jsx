import React from 'react';
import PropTypes from 'prop-types';

const AuthTabs = ({ activeTab, onTabChange }) => {
    return (
        <div className="mb-8">
            <div className="flex border-b-2">
                <button
                    className={`p-3 w-1/2 text-center ${activeTab === 'signin' ? 'border-b-2 border-indigo-500' : ''}`}
                    onClick={() => onTabChange('signin')}
                >
                    Sign In
                </button>
                <button
                    className={`p-3 w-1/2 text-center ${activeTab === 'signup' ? 'border-b-2 border-indigo-500' : ''}`}
                    onClick={() => onTabChange('signup')}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

AuthTabs.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
};

export default AuthTabs;

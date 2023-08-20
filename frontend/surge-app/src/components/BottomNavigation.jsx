import { useState } from 'react';
import homeIcon from '../assets/icons/home.svg';
import createPostIcon from '../assets/icons/plus.svg';
import userProfileIcon from '../assets/icons/user.svg';
import CreatePostModal from '././CreatePostModal';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const BottomNavigation = () => {
    const signOut = useSignOut();
    const navigate = useNavigate(); // Get the navigate function from react-router-dom

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSignOut = () => {
        signOut();
        navigate('/auth'); // Navigate to the auth page after signing out
    };

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-2 flex justify-around items-center">
            {/* Home Tab */}
            <a href="/home" className="flex flex-col items-center">
                <img src={homeIcon} alt="Home Icon" className="h-6 w-6" />
                Home
            </a>

            {/* Create Post Tab */}
            <a onClick={openModal} className="flex flex-col items-center">
                <img src={createPostIcon} alt="Create Post Icon" className="h-6 w-6" />
                Create Post
            </a>

            {/* User Profile Tab */}
            <a href="/profile" className="flex flex-col items-center">
                <img src={userProfileIcon} alt="User Profile Icon" className="h-6 w-6" />
                <button
                    onClick={handleSignOut} // Use the handleSignOut function
                    className="text-red-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sign Out
                </button>
            </a>
            <CreatePostModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
            />
        </nav>
    );
};

export default BottomNavigation;

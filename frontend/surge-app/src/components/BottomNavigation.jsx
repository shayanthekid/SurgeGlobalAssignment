import React, { useState } from 'react';
import homeIcon from '../assets/icons/home.svg'; 
import createPostIcon from '../assets/icons/plus.svg'; 
import userProfileIcon from '../assets/icons/user.svg';
import CreatePostModal from '././CreatePostModal'; // Make sure to provide the correct path

const BottomNavigation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitPost = (image, caption) => {
        // Implement the logic to send the post data to your backend
        console.log('Image:', image);
        console.log('Caption:', caption);
        closeModal();
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

                Profile
            </a>
            <CreatePostModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                onSubmit={handleSubmitPost}
            />
        </nav>
    );
};

export default BottomNavigation;

import { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const CreatePostModal = ({ isOpen, onRequestClose }) => {
    const API_URL = 'http://localhost:5000/api';

    const [image, setImage] = useState('');
    const [caption, setCaption] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const uploadedImageURL = await uploadImage(image);
            // Now you can call your onSubmit function and pass the uploadedImageURL and caption
            const postData = {
                imageURL: uploadedImageURL,
                description: caption,
            };

            const post = await createPost(postData);
            console.log('Post created successfully:', post);
            onRequestClose();            
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle the error, show a message, etc.
        }
    };

    const uploadImage = async (imageFile) => {
        const formData = new FormData();
        formData.append('filename', imageFile);

        try {
            const response = await fetch(`${API_URL}/posts/addimg`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            if (response.status !== 200) {
                throw new Error(data.message);
            } 

            return data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const getToken = () => {
        // get all cookies from the browser
        const cookies = document.cookie.split('; ');
        // find the cookie that starts with '_auth='
        const cookie = cookies.find((cookie) => cookie.startsWith('_auth='));
        // if there is no cookie, return null
        if (!cookie) {
            return null;
        }

        // get the token from the cookie
        const token = cookie.split('=')[1];
        return token;
    }

    const createPost = async (postData) => {
        const token = getToken();

        try {   
            const response = await fetch(`${API_URL}/posts/add`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();
            if (response.status !== 201) {
                throw new Error(data.message);
            }

            // Handle the success
            console.log('Post created successfully:', data);
            return data;
        } catch (error) {
            console.error('Error creating post:', error);
            // Handle the error, show a message, etc.
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Create Post Modal"
            className="flex items-center justify-center h-screen"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={onRequestClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            onChange={(e) => setImage(e.target.files[0])}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                            Caption
                        </label>
                        <textarea
                            id="caption"
                            className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Add a caption..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Post
                    </button>
                </form>
            </div>
        </Modal>
    );
};

CreatePostModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default CreatePostModal;

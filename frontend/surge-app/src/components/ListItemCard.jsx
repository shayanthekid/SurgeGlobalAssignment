import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import likeIcon from '../assets/icons/heart.svg';
import likedIcon from '../assets/icons/heartred.svg';

import { useAuthUser } from 'react-auth-kit'
import { getToken } from '../utils';

const ListItemCard = ({ imageSrc, likes, username, date, postId, description }) => {
    const [likeState, setLikeState] = useState(likes);

    const auth = useAuthUser();
    const { _id } = auth();

    // Handles liking a post
    const likePost = async (postId) => {
        const API_URL = 'http://localhost:5000/api';
        const token = getToken(); // get token from cookies
        
        // Handling optimistic UI update
        // This means, assuming the request will be successful, update the UI first 
        // to make the app feel more responsive, instant

        // If user has already liked the post, then unlike it
        if (likes.includes(_id)) {
            // remove the user id from the likes array
            let newLikes = likes.filter((id) => id !== _id);
            // update the state
            setLikeState(newLikes);
        } else {
            // if user has not liked the post, then like it
            // add the user id to the likes array and update the state
           setLikeState([...likes, _id]);
        }

        // Now make the request to the server
        try {
            const response = await fetch(`${API_URL}/like/${postId}`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            // If the request was not successful, revert the optimistic UI update
            if (response.status !== 200) {
                // Revert the optimistic UI update, set the likes back to what it was
                setLikeState(likes);
                // Create an alert to let the user know that the request was not successful (change this to a toast notification?)
                alert("Error liking post");
                throw new Error(data.message);
            }
           
            return data
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const renderLikes = () => {
        // check if user has liked the post, if their id is in the likes array
        const userLiked = likeState.includes(_id);

        return (
            <div className="flex items-center space-x-2">
                {/* if user liked then show the likedicon, if not show the non liked icon */}
                <img src={userLiked ? likedIcon : likeIcon} alt="Like Icon" className="h-4 w-4" onClick={()=> likePost(postId)}/>
                <span> {likeState && likeState.length} </span>
             </div>  
        )
    }

    
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mx-auto max-w-sm">
            <img src={imageSrc} alt="List Item" className="w-full h-64 object-cover rounded-t-lg" />

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                    {renderLikes()}
                </div>
                <span>{username}</span>
                <span>{date}</span>
            </div>

            <div className="flex w-full justify-between items-center mt-2">
                <p className="mt-2 text-semibold">{description} </p>
            </div>
        </div>
    );
};

ListItemCard.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default ListItemCard;

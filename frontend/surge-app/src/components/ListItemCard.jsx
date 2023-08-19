import React from 'react';
import PropTypes from 'prop-types';
import userProfileIcon from '../assets/icons/user.svg';

const ListItemCard = ({ imageSrc, likeCount, username, date }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mx-auto max-w-sm">
            <img src={imageSrc} alt="List Item" className="w-full h-64 object-cover rounded-t-lg" />

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                    <img src={userProfileIcon} alt="Like Icon" className="h-4 w-4" />
                    <span>{likeCount}</span>
                </div>
                <span>{username}</span>
                <span>{date}</span>
            </div>
        </div>
    );
};

ListItemCard.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    likeCount: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
};


export default ListItemCard;

import React, { useState, useEffect } from 'react';
import ListItemCard from '../components/ListItemCard';
import BottomNavigation from '../components/BottomNavigation';


const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts from backend using fetch
        fetch('http://localhost:5000/api/posts/getAll')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.posts)) {
                    setPosts(data.posts); // Update state with fetched posts
                } else {
                    throw new Error('Received data is not in the expected format');
                }
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []); // Empty dependency array to run the effect once on mount

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="fixed left-10 top-10 ">Logo</h1>
            <div className="space-y-4 max-h-[90vh] overflow-y-auto">
               
                {posts.map((post) => (
                    <ListItemCard
                        key={post._id}
                        imageSrc={post.imageURI}
                        likeCount={post.likeCount} // Assuming there's a likes array
                        username={post.userId.username} // Assuming there's a user field with a username
                        date={post.dateCreated}
                    />
                ))}
            </div>
        
            <BottomNavigation />
        </div>
    );
};

export default Home;
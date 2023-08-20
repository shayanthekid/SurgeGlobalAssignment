import React, { useState, useEffect, useRef } from 'react';
import ListItemCard from '../components/ListItemCard';
import BottomNavigation from '../components/BottomNavigation';
import { useQuery } from 'react-query';


const Home = () => {
    const fetchPosts = async (page = 1) => {
        const response = await fetch(`http://localhost:5000/api/posts/getAll?page=${page}`);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        return {
            posts: data.posts,
            hasNextPage: data.hasNextPage
        };
    };

    const { data, error, isFetchingMore, fetchMore, canFetchMore } = useQuery(
        ['posts', 1], // Initial query key with page number 1
        (_, page) => fetchPosts(page),
        {
            getFetchMore: (lastGroup, allGroups) => {
                if (!lastGroup.hasNextPage) {
                    return false; // Stop fetching more if there are no more pages
                }
                // Calculate the next page number based on your API's structure
                return allGroups.length + 1;
            },
            fetchMore: (newPage, allGroups) => fetchPosts(newPage), // Add this callback
        }
    );

    if (error) {
        console.error('Error fetching posts:', error);
    }

    const formatTimeAgo = (date) => {
        const currentDate = new Date();
        const postDate = new Date(date);
        const timeDiff = currentDate - postDate;
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `Posted ${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else if (hours > 0) {
            return `Posted ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (minutes > 0) {
            return `Posted ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else {
            return `Posted ${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
        }
    };

    const containerRef = useRef(null);

    const handleScroll = () => {
        console.log("Scrolling...");
        if (
            containerRef.current &&
            containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight
        ) {
            console.log("Reached bottom of container");
            if (canFetchMore && !isFetchingMore) {
                const nextPage = Math.ceil(data?.posts.length / 10) + 1; // Calculate the next page number
                
                fetchMore(nextPage);
            }
        }
        
    };

    useEffect(() => {
        containerRef.current.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="fixed left-10 top-10 ">Logo</h1>
            <div ref={containerRef} className="space-y-4 max-h-[90vh] overflow-y-auto">

                {data?.posts.map((post) => (
                    <ListItemCard
                        key={post._id}
                        imageSrc={post.imageURI}
                        likeCount={post.likeCount}
                        username={post.userId.username}
                        date={formatTimeAgo(post.dateCreated)} // Format the date
                    />
                ))}
                {isFetchingMore && <p>Loading more...</p>}

                {/* This conditional rendering ensures that the loading paragraph is only displayed at the bottom */}
                {!canFetchMore && !isFetchingMore && <p>All posts loaded.</p>}
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Home;
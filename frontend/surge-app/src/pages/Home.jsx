import React from 'react';
import ListItemCard from '../components/ListItemCard';
import BottomNavigation from '../components/BottomNavigation';
const dummyListData = [
    {
        id: 1,
        imageSrc: '../assets/img/bingus.png',
        likeCount: 10,
        username: 'user1',
        date: '2023-08-18',
    },
    {
        id: 2,
        imageSrc: 'path-to-image-2.jpg',
        likeCount: 20,
        username: 'user2',
        date: '2023-08-19',
    },
    {
        id: 3,
        imageSrc: 'path-to-image-3.jpg',
        likeCount: 5,
        username: 'user3',
        date: '2023-08-20',
    },
    // Add more items as needed
];

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="fixed left-10 top-10 ">Logo</h1>
            <div className="space-y-4">
               
                {dummyListData.map((item) => (
                    <ListItemCard
                        key={item.id}
                        imageSrc={item.imageSrc}
                        likeCount={item.likeCount}
                        username={item.username}
                        date={item.date}
                    />
                ))}
            </div>
        
            <BottomNavigation />
        </div>
    );
};

export default Home;
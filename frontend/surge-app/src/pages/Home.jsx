import React, { useEffect} from 'react';
import ListItemCard from '../components/ListItemCard';
import BottomNavigation from '../components/BottomNavigation';
import { useInfiniteQuery } from 'react-query';

const Home = () => {
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

    const fetchPosts = async (pageParam = 1) => {
        const API_URL = 'http://localhost:5000/api';
        const token = getToken();
        
        try{
                const response = await fetch(`${API_URL}/posts/getAll?page=${pageParam}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            
            const data = await response.json();
            return data
        } catch (error) {
            console.error(error);
            return error;
        }
    };

   const {
       error,
       data,
       fetchNextPage,
       hasNextPage,
       isFetchingNextPage
   } = useInfiniteQuery({
       queryKey: ['posts'],
       queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
       getNextPageParam: (lastPage, pages) => {
           const maxPages = Math.ceil(lastPage.total / lastPage.count);
           const nextPage = pages.length + 1;
           return nextPage <= maxPages ? nextPage : undefined;
       },
   });

   // Infinite scroll
   useEffect(() => {
       let fetching = false;
       const onScroll = async (event) => {
           const {
               scrollHeight,
               scrollTop,
               clientHeight
           } =
           event.target.scrollingElement;
           console.log(
            `scrollHeight: ${scrollHeight}, scrollTop: ${scrollTop}, clientHeight: ${clientHeight}`
           );

           console.log(`fetching: ${fetching}`);

           if (!fetching && scrollHeight - scrollTop <= clientHeight) {
               fetching = true;
               if (hasNextPage) await fetchNextPage();
               fetching = false;
           }
       };

       document.addEventListener("scroll", onScroll);
    
       return () => {
           document.removeEventListener("scroll", onScroll);
       };
       // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [hasNextPage]);

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

    if (error instanceof Error) {
        return <div> An error has occurred: {error.message} </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="fixed left-10 top-10 ">Logo</h1>
            <div className="space-y-4 max-h-[90vh] overflow-y-auto">
                {data && data.pages && data?.pages.map((page, index) => {
                    return (
                        <React.Fragment key={index}>
                            {page.data.map((post) => {
                                return (
                                    <ListItemCard
                                        key={post._id}
                                        imageSrc={post.imageURI}
                                        likes={post.likes}
                                        username = {post.userId.username}
                                        date={formatTimeAgo(post.dateCreated)}
                                        postId={post._id}
                                        description={post.description}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                })}
                {isFetchingNextPage && <p> Loading more... </p>}

                {hasNextPage && !isFetchingNextPage && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => fetchNextPage()}
                    >
                        Load More
                    </button>
                )}

                {/* This conditional rendering ensures that the loading paragraph is only displayed at the bottom */}
                {/* {!isLoading && !isFetchingNextPage && (<p> All posts loaded. </p>)} */}
            </div>
            <BottomNavigation />
        </div>
    );
};

export default Home;
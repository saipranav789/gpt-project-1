import React,{useState,useEffect} from 'react';
import axios from 'axios'
import FeedCard from '../components/FeedCard/FeedCard';

const LandingPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/posts")
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="landing-page">
            <section className="welcome">
                <h1>Welcome to The Bulletin</h1>
                <p>Discover a world of ideas and connections. The Bulletin is your platform to share news, thoughts, and inspiration with a community of like-minded individuals. Join the conversation today!</p>
            </section>
            <section className='feed'>
                <div>
                    {data && data.map((item) => (
                        <FeedCard key={item.id} data={item} />
                    )).reverse()}
                </div>
            </section>
        </div>
    );
};
    

export default LandingPage;

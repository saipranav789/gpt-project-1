import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import EditPostModal from '../PostModal/EditPostModal';

const FeedCard = (props) => {
    const { user } = useContext(AuthContext);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (user && user.data && user.data.token) {
        console.log(user.data.token);
    }

    const handleDelete = async (id) => {
        if (!user || isDeleted) return;

        try {
            const response = await axios.delete(`http://localhost:3000/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.data.token}`
                }
            });

            alert('Post has been deleted.');
            setIsDeleted(true);
            console.log(response.data);
            props.fetchData(); // Refetch data after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('User is not the owner!');
        }
    };

    if (isDeleted) return null;
    console.log("props:", props);

    return (
        <div className="card" style={styles.card}>
            <h2>{props.data?.email}</h2>
            <p>{props.data?.content}</p>
            {user && user.data.email === props.data.email && (
                <>
                    <button className='style-button' onClick={() => handleDelete(props.data.id)}>
                        Delete
                    </button>
                    <button className='style-button' onClick={() => setIsEditModalOpen(true)}>
                        Edit
                    </button>
                    <EditPostModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            props.fetchData(); // Refetch data after editing
                        }}
                        postId={props.data.id}
                        currentContent={props.data.content}
                    />
                </>
            )}
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'white',
        border: '1px solid black',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '16px',
    },
};

export default FeedCard;

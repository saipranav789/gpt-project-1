import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const EditPostModal = ({ isOpen, onClose, postId, currentContent }) => {
    const [content, setContent] = useState(currentContent);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        setContent(currentContent);
    }, [currentContent]);

    if (!isOpen) return null; // Do not render modal if it's not open

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to edit post.');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:3000/posts/${postId}`,
                { content },
                {
                    headers: {
                        'Authorization': `Bearer ${user.data.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                alert('Post updated successfully!');
                onClose(); // Close the modal
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post.');
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Edit Post</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter your post content here..."
                        rows="4"
                        style={styles.textarea}
                    />
                    <button type="submit" style={styles.button}>Update</button>
                    <button type="button" onClick={onClose} style={styles.button}>Close</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    textarea: {
        width: '80%',
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        margin: '5px',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
    },
};

export default EditPostModal;

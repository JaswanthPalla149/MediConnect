import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import './AdminPostList.css'; // Ensure your custom styles are included
const url = process.env.REACT_APP_BACKURL;
const AdminPostList = ({ username, domain, id }) => {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [comments, setComments] = useState({});
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                console.log(`url : ${url}`);
                const res = await axios.get(`${url}/api/posts`);
                const filteredPosts = res.data.filter(post => post.domain === domain);
                setPosts(filteredPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [domain]);

    const handleLikePost = async (postId) => {
        try {
            const isLiked = likedPosts.includes(postId);

            if (isLiked) {
                const res = await axios.post(`${url}/api/posts/${postId}/unlike`, { userId: username });
                setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
                setPosts(prevPosts => prevPosts.map(post => (post._id === postId ? { ...post, likes: res.data.likes } : post)));
            } else {
                const res = await axios.post(`${url}/api/posts/${postId}/like`, { userId: username });
                setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
                setPosts(prevPosts => prevPosts.map(post => (post._id === postId ? { ...post, likes: res.data.likes } : post)));
            }
        } catch (error) {
            console.error('Error toggling like status:', error);
        }
    };

    const handleCommentPost = async (postId, content) => {
        try {
            const sentimentResponse = await axios.post('${url}/api/sentiment', { text: content });
            const sentimentScore = sentimentResponse.data.compound;
            const res = await axios.post(`${url}/api/posts/${postId}/comment`, { username, content });

            setPosts(prevPosts => prevPosts.map(post => (post._id === res.data._id ? res.data : post)));
            await axios.post(`${url}/api/users/${username}/comments`, {
                content: content,
                postId: postId,
                sentimentScore: sentimentScore,
            });

            setComments(prevComments => ({ ...prevComments, [postId]: { content: '' } }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${url}/api/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const res = await axios.delete(`${url}/api/posts/${postId}/comments/${commentId}`);
            setPosts(prevPosts => prevPosts.map(post =>
                post._id === postId ? { ...post, comments: res.data.comments } : post
            ));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <Container className="my-4 post-list-container">
            <h2 className="text-center post-domain-title">
                Posts in {domain.charAt(0).toUpperCase() + domain.slice(1)} Domain
            </h2>
            <Row>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Col key={post._id} md={6} lg={4} className="mb-4">
                            <Card className="text-only-card shadow-sm p-3 mb-5">
                                <Card.Body>
                                    <Card.Title className="text-only-card-title">{post.title}</Card.Title>
                                    <Card.Text className="text-only-card-content">{post.content}</Card.Text>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => handleLikePost(post._id)}
                                            className="like-button"
                                        >
                                            {likedPosts.includes(post._id) ? <FaHeart /> : <FaRegHeart />} {post.likes}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeletePost(post._id)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                    <Form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            const content = comments[post._id]?.content || '';
                                            handleCommentPost(post._id, content);
                                        }}
                                        className="mt-3"
                                    >
                                        <Form.Group controlId={`comment-${post._id}`}>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Leave a comment"
                                                required
                                                onChange={e => setComments({ ...comments, [post._id]: { content: e.target.value } })}
                                                value={comments[post._id]?.content || ''}
                                            />
                                        </Form.Group>
                                        <Button type="submit" className="mt-2">Submit</Button>
                                    </Form>
                                    <div className="comments-section mt-3">
                                        <h6>Comments:</h6>
                                        {post.comments.map(comment => (
                                            <div key={comment._id} className="post-comment d-flex justify-content-between">
                                                <div>
                                                    <strong>{comment.username}</strong>: {comment.content}
                                                </div>
                                                <Button
                                                    variant="link"
                                                    className="p-0 text-danger"
                                                    onClick={() => handleDeleteComment(post._id, comment._id)}
                                                    aria-label="Delete comment"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No posts available for this domain.</p>
                )}
            </Row>
        </Container>
    );
};

export default AdminPostList;

import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';

const AdminPostList = ({ username, domain, id }) => {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [comments, setComments] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts');
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

            // Send appropriate request for like or unlike
            if (isLiked) {
                // Unlike the post
                const res = await axios.post(`http://localhost:5000/api/posts/${postId}/unlike`, {
                    userId: username,
                });
                setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === postId ? { ...post, likes: res.data.likes } : post
                    )
                );
            } else {
                // Like the post
                const res = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {
                    userId: username,
                });
                setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === postId ? { ...post, likes: res.data.likes } : post
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling like status:', error);
        }
    };

    const handleCommentPost = async (postId, content) => {
        try {
            const sentimentResponse = await axios.post('http://localhost:5000/api/sentiment', { text: content });
            const sentimentScore = sentimentResponse.data.compound;
            const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { username, content });

            setPosts(prevPosts =>
                prevPosts.map(post => (post._id === res.data._id ? res.data : post))
            );

            await axios.post(`http://localhost:5000/api/users/${username}/comments`, {
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
            await axios.delete(`http://localhost:5000/api/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId)); // Remove the deleted post from the UI
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <Container className="my-4">
            <h2>Posts in {domain.charAt(0).toUpperCase() + domain.slice(1)} Domain</h2>
            <Row>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Col key={post._id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text>{post.content}</Card.Text>
                                    <Card.Text>Likes: {post.likes}</Card.Text>

                                    {/* Like Button */}
                                    <Button
                                        variant="link"
                                        onClick={() => handleLikePost(post._id)}
                                        className="like-button"
                                        style={{ color: likedPosts.includes(post._id) ? 'red' : 'gray' }}
                                    >
                                        {likedPosts.includes(post._id) ? <FaHeart /> : <FaRegHeart />}
                                    </Button>

                                    {/* Delete Button */}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeletePost(post._id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </Button>

                                    {/* Comment Form */}
                                    <Form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            const content = comments[post._id]?.content || '';
                                            handleCommentPost(post._id, content);
                                        }}
                                    >
                                        <Form.Group controlId={`comment-${post._id}`}>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Your Comment"
                                                required
                                                onChange={e => setComments({ ...comments, [post._id]: { content: e.target.value } })}
                                                value={comments[post._id]?.content || ''}
                                            />
                                        </Form.Group>
                                        <Button type="submit">Comment</Button>
                                    </Form>

                                    {/* Display Comments */}
                                    <h5>Comments:</h5>
                                    {post.comments.map((comment, index) => (
                                        <div key={index}>
                                            <strong>{comment.username}</strong>: {comment.content}
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No posts available for this domain.</p>
                )}
            </Row>
        </Container>
    );
};

export default AdminPostList;
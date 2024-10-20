import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({}); 

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts');
                setPosts(res.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    
    const handleLikePost = async (postId) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
            setPosts((prevPosts) => 
                prevPosts.map((post) => (post._id === res.data._id ? res.data : post))
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    
    const handleCommentPost = async (postId, username, content) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { username, content });
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post._id === res.data._id ? res.data : post))
            );
            setComments((prevComments) => ({ ...prevComments, [postId]: { username: '', content: '' } })); 
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <Container className="my-4">
            <h2>Posts</h2>
            <Row>
                {posts.map((post) => (
                    <Col key={post._id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.content}</Card.Text>
                                <Card.Text>Likes: {post.likes}</Card.Text>
                                <Button variant="link" onClick={() => handleLikePost(post._id)}>Like</Button>

                                {/* Comment Form */}
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    const username = comments[post._id]?.username || '';
                                    const content = comments[post._id]?.content || '';
                                    handleCommentPost(post._id, username, content);
                                }}>
                                    <Form.Group controlId={`comment-${post._id}`}>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Your Name" 
                                            required 
                                            onChange={(e) => setComments({ ...comments, [post._id]: { ...comments[post._id], username: e.target.value, content: comments[post._id]?.content || '' } })}
                                            value={comments[post._id]?.username || ''}
                                        />
                                        <Form.Control 
                                            as="textarea"
                                            rows={3}
                                            placeholder="Your Comment" 
                                            required 
                                            onChange={(e) => setComments({ ...comments, [post._id]: { ...comments[post._id]?.username || '', content: e.target.value } })}
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
                ))}
            </Row>
        </Container>
    );
};

export default PostList;
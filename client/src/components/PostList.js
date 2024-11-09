import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './PostList.css'; 

const PostList = ({username, id, domain}) => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({}); 
    const [likedPosts, setLikedPosts] = useState([]);
    //const [username, setUsername] = useState(null);
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
    }, []);

    const handleLikePost = async (postId) => {
        try {
            // Send a request to toggle the like and update user interactions
            const res = await axios.post('http://localhost:5000/api/users/interactions/like', { 
                userId: username, // Pass the current user's ID here
                postId
            });
    
            // Update likedPosts directly from the response, ensuring synchronization with backend
            setLikedPosts(res.data.likedPosts.map((like) => like.postId));
    
            // Update the specific post in the posts state with the new like count
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId ? { ...post, likes: res.data.postLikes } : post
                )
            );
    
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };
    
   /* const handleLikePost = async (postId) => {
        try {
            // Check if the post is already liked
            const isLiked = likedPosts.includes(postId);

            // Toggle like or dislike
            const res = await axios.post(`http://localhost:5000/api/posts/${postId}/${isLiked ? 'dislike' : 'like'}`);

            // Update the liked posts list
            if (isLiked) {
                // Remove from liked posts if already liked
                setLikedPosts(likedPosts.filter(id => id !== postId));
            } else {
                // Add to liked posts if not liked yet
                setLikedPosts([...likedPosts, postId]);
            }

            // Update the posts with the new like/dislike count
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === res.data._id ? res.data : post
                )
            );
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };*/

    
    const handleCommentPost = async (postId, username, content) => {
        try {
            const sentimentResponse = await axios.post('http://localhost:5000/api/sentiment', { text: content });
            console.log('calculating your sentiment score');
            const sentimentScore = sentimentResponse.data.compound;
            console.log(`Sentiment Score: ${sentimentScore}`);
            const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { username, content });
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post._id === res.data._id ? res.data : post))
            );
            
            const response = await axios.post(
                `http://localhost:5000/api/users/${username}/comments`, 
                {
                    content: content,
                    postId: postId, 
                    sentimentScore: sentimentScore
                }
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

                                {/* Like Button with Toggle */}
                                <Button
                                    variant="link"
                                    onClick={() => handleLikePost(post._id)}
                                    className="like-button"
                                    style={{ color: likedPosts.includes(post._id) ? 'red' : 'gray' }}
                                >
                                    {likedPosts.includes(post._id) ? <FaHeart /> : <FaRegHeart />}
                                </Button>

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
                                    //<div className="blurred">This should be blurred</div>
                                     <div 
                                     key={index} 
                                     //className={/*comment.sentimentScore < -0.25 ?*/ "blurred" /*: ''*/}
                                 >
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
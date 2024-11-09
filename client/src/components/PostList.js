import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';  // Import useParams to access domain from URL
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';

const PostList = ({ username, id }) => {
  const { domain } = useParams(); // Get domain from URL parameter
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [comments, setComments] = useState({});

  // Fetch posts based on the domain
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');  // Fetch all posts
        const filteredPosts = res.data.filter(post => post.domain === domain);  // Filter posts by domain
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [domain]);  // Re-run when domain changes (e.g., from mindfulness to happiness)

  const handleLikePost = async (postId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/interactions/like', { 
        userId: username,  // Pass the current user's ID
        postId
      });
      setLikedPosts(res.data.likedPosts.map(like => like.postId));
      setPosts(prevPosts => prevPosts.map(post => post._id === postId ? { ...post, likes: res.data.postLikes } : post));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentPost = async (postId, username, content) => {
    try {
      const sentimentResponse = await axios.post('http://localhost:5000/api/sentiment', { text: content });
      const sentimentScore = sentimentResponse.data.compound;
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { username, content });

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === res.data._id ? res.data : post))
      );

      await axios.post(`http://localhost:5000/api/users/${username}/comments`, {
        content: content,
        postId: postId,
        sentimentScore: sentimentScore
      });

      setComments((prevComments) => ({ ...prevComments, [postId]: { username: '', content: '' } }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Container className="my-4">
      <h2>Posts in {domain.charAt(0).toUpperCase() + domain.slice(1)} Domain</h2> {/* Capitalize the domain name */}
      <Row>
        {posts.length > 0 ? (
          posts.map((post) => (
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

                  {/* Comment Form */}
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const content = comments[post._id]?.content || '';
                      handleCommentPost(post._id, username, content);
                    }}
                  >
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
          ))
        ) : (
          <p>No posts available for this domain.</p>
        )}
      </Row>
    </Container>
  );
};

export default PostList;

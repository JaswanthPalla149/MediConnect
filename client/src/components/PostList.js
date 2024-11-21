import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import './PostList.css'; // Ensure this file exists with your custom styles

const url = process.env.REACT_APP_BACKURL;

const PostList = ({ username }) => {
  const { domain } = useParams();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [comments, setComments] = useState({});

  const fetchPosts = async () => {
    console.log('setting posts');
    try {
      const res = await axios.get(`${url}/api/posts`);
      const filteredPosts = res.data.filter((post) => post.domain === domain);
      setPosts(filteredPosts);

      // Fetch liked posts for the user (assuming backend provides it)
      const likedRes = await axios.get(`${url}/api/users/${username}/liked-posts`);
      console.log('likedRes.data.likedPosts:', likedRes.data.likedPosts);
      setLikedPosts(likedRes.data.likedPosts);
    } catch (error) {
      console.error('Error fetching posts or liked posts:', error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [username, domain]);  // Dependencies: When `username` or `domain` changes, this effect runs.


  useEffect(() => {
    console.log('Liked posts after state update:', likedPosts);
  }, [likedPosts]);  // This will run every time `likedPosts` is updated


  const handleLikePost = async (postId) => {
    try {
      console.log(`postId : ${postId}`);
      console.log(`liked-posts: ${likedPosts}`);
      const isLiked = likedPosts.includes(postId);
      console.log(`The post liked by you : ${isLiked}`);

      if (isLiked) {
        // If already liked, send an unlike request
        const res = await axios.post(`${url}/api/posts/${postId}/unlike`);
        await axios.post(`${url}/api/users/${username}/set-liked-posts`, { postId: postId });
        setLikedPosts((prevLikedPosts) => prevLikedPosts.filter((id) => id !== postId));
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: res.data.likes } : post
          )
        );
      } else {
        // Otherwise, send a like request
        const res = await axios.post(`${url}/api/posts/${postId}/like`);
        await axios.post(`${url}/api/users/${username}/set-liked-posts`, { postId: postId });
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
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
      const sentimentResponse = await axios.post(`${url}/api/sentiment`, { text: content });
      const sentimentScore = sentimentResponse.data.compound;

      const res = await axios.post(`${url}/api/posts/${postId}/comment`, { username, content });
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === res.data._id ? res.data : post))
      );

      await axios.post(`${url}/api/users/${username}/comments`, {
        content,
        postId,
        sentimentScore,
        domain,
      });

      setComments((prevComments) => ({ ...prevComments, [postId]: { content: '' } }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Container className="my-4 post-list-container">
      <h2 className="text-center post-domain-title">
        Posts in {domain.charAt(0).toUpperCase() + domain.slice(1)} Domain
      </h2>
      <Row>
        {posts.length > 0 ? (
          posts.map((post) => (
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
                  </div>
                  <Form
                    onSubmit={(e) => {
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
                        onChange={(e) =>
                          setComments({ ...comments, [post._id]: { content: e.target.value } })
                        }
                        value={comments[post._id]?.content || ''}
                      />
                    </Form.Group>
                    <Button type="submit" className="mt-2">
                      Submit
                    </Button>
                  </Form>
                  <div className="comments-section mt-3">
                    <h6>Comments:</h6>
                    {post.comments.map((comment, index) => (
                      <div key={index} className="post-comment">
                        <strong>{comment.username}</strong>: {comment.content}
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

export default PostList;

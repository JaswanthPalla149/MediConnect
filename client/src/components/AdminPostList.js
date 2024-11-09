import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Button, Form } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const AdminPost = ({ username, domain = "engagement" }) => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        if (domain) {
            const fetchPosts = async () => {
                try {
                    const res = await axios.get(
                        `http://localhost:5000/api/posts/domain/${domain}`
                    );
                    setPosts(res.data);
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            };
            fetchPosts();
        }
    }, [domain]);

    const handleLikePost = async (postId) => {
        try {
            // Check if the post is already liked
            const isLiked = likedPosts.includes(postId);

            if (!isLiked) {
                // If the post is not liked, send a like request
                const res = await axios.post(
                    `http://localhost:5000/api/posts/${postId}/like`,
                    {
                        userId: username,
                    }
                );

                // Update liked posts state
                setLikedPosts([...likedPosts, postId]);

                // Update post's likes count
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? { ...post, likes: res.data.postLikes } : post
                    )
                );
            }
        } catch (error) {
            console.error("Error liking/disliking post:", error);
        }
    };

    const handleCommentPost = async (postId, content) => {
        try {
            const finalUsername = username; // Always use the logged-in user's username

            const res = await axios.post(
                `http://localhost:5000/api/posts/${postId}/comment`,
                {
                    username: finalUsername,
                    content,
                }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) => (post._id === res.data._id ? res.data : post))
            );

            setComments((prevComments) => ({
                ...prevComments,
                [postId]: { content: "" },
            }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <Container className="my-4">
            <h2>Posts</h2>
            <Row>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Col key={post._id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text>{post.content}</Card.Text>
                                    <Card.Text>Likes: {post.likes}</Card.Text>

                                    <Button
                                        variant="link"
                                        onClick={() => handleLikePost(post._id)}
                                        className="like-button"
                                        style={{
                                            color: likedPosts.includes(post._id) ? "red" : "gray",
                                        }}
                                    >
                                        {likedPosts.includes(post._id) ? (
                                            <FaHeart />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                    </Button>

                                    <Form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const content = comments[post._id]?.content || "";
                                            handleCommentPost(post._id, content);
                                        }}
                                    >
                                        <Form.Group controlId={`comment-${post._id}`}>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Your Comment"
                                                required
                                                onChange={(e) =>
                                                    setComments({
                                                        ...comments,
                                                        [post._id]: { content: e.target.value },
                                                    })
                                                }
                                                value={comments[post._id]?.content || ""}
                                            />
                                        </Form.Group>
                                        <Button type="submit">Comment</Button>
                                    </Form>

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

export default AdminPost;

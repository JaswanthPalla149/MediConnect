import React from 'react';

const Post = ({ post }) => {
    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>By: {post.author}</small>
            <p><small>{new Date(post.createdAt).toLocaleString()}</small></p>
        </div>
    );
};

export default Post;

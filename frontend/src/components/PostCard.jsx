// File: src/components/PostCard.jsx

import React, { useState } from "react";
import axios from "axios";
import "./PostCard.css";

export default function PostCard({ post, onLike, onComment }) {
  const [comment, setComment] = useState("");

  const handleLike = async () => {
    await axios.post(`http://localhost:8080/api/posts/${post.id}/like`, {}, { withCredentials: true });
    onLike(post.id);
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await axios.post(
      `http://localhost:8080/api/posts/${post.id}/comment`,
      { message: comment },
      { withCredentials: true }
    );
    onComment(post.id, comment);
    setComment("");
  };

  const resolveUrl = (path) => path?.startsWith("http") ? path : `http://localhost:8080${path}`;

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={resolveUrl(post.user.profilePicUrl)} alt="Profile" className="avatar" />
        <div>
          <strong>{post.user.firstName} {post.user.lastName}</strong>
          <p className="category">{post.category}</p>
        </div>
      </div>

      <div className="post-body">
        {post.description && <p>{post.description}</p>}
        {post.mediaUrls && post.mediaUrls.map((url, i) => (
          <img
            key={i}
            src={resolveUrl(url)}
            alt="post"
            className="post-media"
          />
        ))}
      </div>

      <div className="post-actions">
        <button onClick={handleLike}>Like</button>
        <button onClick={handleComment}>Comment</button>
      </div>

      <div className="post-likes">
        {post.likes.map((like, i) => (
          <img
            key={i}
            src={resolveUrl(like.profilePicUrl)}
            alt="like-user"
            className="avatar-small"
            title={like.fullName}
          />
        ))}
      </div>

      <div className="post-comments">
        {post.comments.map((c, i) => (
          <div key={i} className="comment">
            <img
              src={resolveUrl(c.profilePicUrl)}
              alt="comment-user"
              className="avatar-small"
            />
            <div><strong>{c.fullName}</strong>: {c.message}</div>
          </div>
        ))}
      </div>

      <div className="comment-box">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleComment}>Send</button>
      </div>
    </div>
  );
}

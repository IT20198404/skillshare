// File: src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [text, setText] = useState("");  // This is where we define the 'text' state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user email
        const userRes = await axios.get("http://localhost:8080/api/user/me", {
          withCredentials: true,
        });
        const email = userRes.data.email;
        setCurrentUserEmail(email);

        // Get posts
        const postRes = await axios.get("http://localhost:8080/api/posts", {
          withCredentials: true,
        });

        // Set likedByUser flag for each post
        const postsWithLikedFlag = postRes.data.map((post) => ({
          ...post,
          likedByUser: post.likes?.some((like) => like.userEmail === email),
        }));

        setPosts(postsWithLikedFlag);
      } catch (err) {
        console.error("Error fetching feed or user:", err);
      }
    };

    fetchData();
  }, []);

  const resolveUrl = (path) =>
    path?.startsWith("http") ? path : `http://localhost:8080${path}`;

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: true,
                likes: [...(post.likes || []), { userEmail: currentUserEmail }],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/comment`,
        { message: commentText },
        { withCredentials: true }
      );
      // Refresh comments (simple approach: reload everything)
      window.location.reload();
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  return (
    <div className="container">
      <h2>Home Feed</h2>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="post-header">
            <img
              src={resolveUrl(post.likes?.[0]?.profilePicUrl || post.profilePicUrl || "")}
              alt="user"
            />
            <div>
              <strong>{post.likes?.[0]?.userName || post.fullName || post.userEmail}</strong>
              <p className="category">{post.category || "Skill Post"}</p>
            </div>
          </div>

          <div className="post-body">
            <p>{post.description || post.message || post.topic}</p>
            {(post.mediaUrls || []).map((url, i) => (
              <img key={i} src={resolveUrl(url)} alt="post-media" className="post-media" />
            ))}
          </div>

          <div className="post-actions">
            <button
              className="like"
              disabled={post.likedByUser}
              onClick={() => handleLike(post.id)}
            >
              ❤️ Like
            </button>
            <span>{(post.likes || []).length} likes</span>
            <button className="comment">💬 Comment</button>
          </div>

          <div className="post-comments">
            {(post.comments || []).map((c, i) => (
              <div key={i} className="comment">
                <img src={resolveUrl(c.profilePicUrl)} alt={c.userName} />
                <div>
                  <strong>{c.userName}</strong>: <span className="comment-text">{c.message}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="comment-box">
            <input
              type="text"
              placeholder="Write a comment..."
              value={text}  // Bind the text state to the input
              onChange={(e) => setText(e.target.value)}  // Use setText to update the state
            />
            <button onClick={() => handleComment(post.id, text)}>Post</button>
          </div>
        </div>
      ))}
    </div>
  );
}

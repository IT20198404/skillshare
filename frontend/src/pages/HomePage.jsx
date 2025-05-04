// File: src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get current user email
        const userRes = await axios.get("http://localhost:8080/api/user/me", {
          withCredentials: true,
        });
        const email = userRes.data.email;
        setCurrentUserEmail(email);

        // 2. Get posts
        const postRes = await axios.get("http://localhost:8080/api/posts", {
          withCredentials: true,
        });

        // 3. Set likedByUser flag for each post
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
      <h2>🔔 Home Feed</h2>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={resolveUrl(
                post.likes?.[0]?.profilePicUrl || post.profilePicUrl || ""
              )}
              alt="user"
              width={40}
              height={40}
              style={{ borderRadius: "50%", marginRight: 10 }}
            />
            <div>
              <p>
                <strong>
                  {post.likes?.[0]?.userName || post.fullName || post.userEmail}
                </strong>
              </p>
              <p style={{ fontSize: 12 }}>{post.category || "Skill Post"}</p>
            </div>
          </div>

          <p>{post.description || post.message || post.topic}</p>

          {(post.mediaUrls || []).map((url, i) => (
            <img
              key={i}
              src={resolveUrl(url)}
              alt="media"
              width={150}
              style={{ marginRight: 5 }}
            />
          ))}

          <div style={{ marginTop: 10 }}>
            <button disabled={post.likedByUser} onClick={() => handleLike(post.id)}>
              ❤️ Like
            </button>
            <span style={{ marginLeft: 10 }}>{(post.likes || []).length} likes</span>
          </div>

          <div style={{ marginTop: 5 }}>
            {(post.likes || []).map((like, idx) => (
              <img
                key={idx}
                src={resolveUrl(like.profilePicUrl)}
                alt={like.userName}
                title={like.userName}
                width={25}
                height={25}
                style={{ borderRadius: "50%", marginRight: 3 }}
              />
            ))}
          </div>

          <div>
            <h4 style={{ marginTop: 10 }}>💬 Comments</h4>
            {(post.comments || []).map((c, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
              >
                <img
                  src={resolveUrl(c.profilePicUrl)}
                  alt={c.userName}
                  width={25}
                  height={25}
                  style={{ borderRadius: "50%", marginRight: 5 }}
                />
                <strong>{c.userName}</strong>: {c.message}
              </div>
            ))}
            <CommentInput postId={post.id} onSubmit={handleComment} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentInput({ postId, onSubmit }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(postId, text);
        setText("");
      }}
    >
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "80%", marginRight: 5 }}
      />
      <button type="submit">Post</button>
    </form>
  );
}

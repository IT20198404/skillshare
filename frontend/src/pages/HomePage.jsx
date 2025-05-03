import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/feed", { withCredentials: true })
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to fetch feed:", err));
  }, []);

  const resolveUrl = (path) => path?.startsWith("http") ? path : `http://localhost:8080${path}`;

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8080/api/feed/${postId}/like`, {}, { withCredentials: true });
      setPosts(prev => prev.map(post => post.id === postId ? { ...post, likedByUser: true, likeCount: post.likeCount + 1 } : post));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!commentText) return;
    try {
      await axios.post(`http://localhost:8080/api/feed/${postId}/comment`, { text: commentText }, { withCredentials: true });
      setPosts(prev => prev.map(post => post.id === postId ? {
        ...post,
        comments: [...post.comments, { text: commentText, userName: "You", userPic: null }]
      } : post));
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  return (
    <div className="container">
      <h2>🔔 Home Feed</h2>
      {posts.map(post => (
        <div key={post.id} className="post">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={resolveUrl(post.userPic)} alt="user" width={40} height={40} style={{ borderRadius: "50%", marginRight: 10 }} />
            <div>
              <p><strong>{post.userName}</strong></p>
              <p style={{ fontSize: 12 }}>{post.category}</p>
            </div>
          </div>

          <p>{post.description || post.message || post.topic}</p>

          {(post.mediaUrls || []).map((url, i) => (
            <img key={i} src={resolveUrl(url)} alt="media" width={150} style={{ marginRight: 5 }} />
          ))}

          <div style={{ marginTop: 10 }}>
            <button disabled={post.likedByUser} onClick={() => handleLike(post.id)}>❤️ Like</button>
            <span style={{ marginLeft: 10 }}>{post.likeCount || 0} likes</span>
          </div>

          {/* Small profile pictures of those who liked */}
          <div style={{ marginTop: 5 }}>
            {(post.likedUsers || []).map((user, idx) => (
              <img key={idx} src={resolveUrl(user.profilePicUrl)} alt={user.name} title={user.name} width={25} height={25} style={{ borderRadius: "50%", marginRight: 3 }} />
            ))}
          </div>

          {/* Comments */}
          <div>
            <h4 style={{ marginTop: 10 }}>💬 Comments</h4>
            {(post.comments || []).map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                <img src={resolveUrl(c.userPic)} alt={c.userName} width={25} height={25} style={{ borderRadius: "50%", marginRight: 5 }} />
                <strong>{c.userName}</strong>: {c.text}
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
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(postId, text);
      setText("");
    }}>
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

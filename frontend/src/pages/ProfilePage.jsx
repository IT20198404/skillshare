import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [plans, setPlans] = useState([]);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", profilePicUrl: "" });
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editingFiles, setEditingFiles] = useState(null);
  const [editingProgress, setEditingProgress] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedProfilePic, setEditedProfilePic] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/user", { withCredentials: true })
      .then(res => {
        if (!res.data.profileSet) navigate("/login");
      })
      .catch(() => navigate("/login"));

    fetchData();
  }, [navigate]);

  const fetchData = () => {
    axios.get("http://localhost:8080/api/posts", { withCredentials: true }).then(res => setPosts(res.data));
    axios.get("http://localhost:8080/api/progress", { withCredentials: true }).then(res => setProgress(res.data));
    axios.get("http://localhost:8080/api/plans", { withCredentials: true }).then(res => setPlans(res.data));
    axios.get("http://localhost:8080/api/user/profile", { withCredentials: true }).then(res => {
      setProfile(res.data);
      setEditedFirstName(res.data.firstName);
      setEditedLastName(res.data.lastName);
    }).finally(() => setLoading(false));
  };

  const resolveUrl = (path) => path?.startsWith("http") ? path : `http://localhost:8080${path}`;

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("firstName", editedFirstName);
    data.append("lastName", editedLastName);
    if (editedProfilePic) data.append("profilePic", editedProfilePic);

    try {
      await axios.put("http://localhost:8080/api/user/profile", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully.");
      setEditingProfile(false);
      fetchData();
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;

    try {
      await axios.delete("http://localhost:8080/api/user/profile", { withCredentials: true });
      alert("Profile deleted successfully.");
      window.location.href = "/login";
    } catch (err) {
      alert("Failed to delete profile.");
    }
  };

  const handleDeletePost = async (postId) => {
    await axios.delete(`http://localhost:8080/api/posts/${postId}`, { withCredentials: true });
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", editingPost.description);
    if (editingFiles) {
      for (const file of editingFiles) {
        formData.append("media", file);
      }
    }
    try {
      await axios.put(`http://localhost:8080/api/posts/${editingPost.id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setEditingPost(null);
      setEditingFiles(null);
      fetchData();
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const handleDeleteProgress = async (progressId) => {
    await axios.delete(`http://localhost:8080/api/progress/${progressId}`, { withCredentials: true });
    setProgress(progress.filter(p => p.id !== progressId));
  };

  const handleEditProgress = async () => {
    await axios.put(`http://localhost:8080/api/progress/${editingProgress.id}`, editingProgress, { withCredentials: true });
    setProgress(progress.map(p => p.id === editingProgress.id ? editingProgress : p));
    setEditingProgress(null);
  };

  const handleDeletePlan = async (planId) => {
    await axios.delete(`http://localhost:8080/api/plans/${planId}`, { withCredentials: true });
    setPlans(plans.filter(p => p.id !== planId));
  };

  const handleEditPlan = async () => {
    await axios.put(`http://localhost:8080/api/plans/${editingPlan.id}`, editingPlan, { withCredentials: true });
    setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
    setEditingPlan(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>My Profile</h2>

      {/* Profile Display and Edit */}
      {!editingProfile ? (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src={resolveUrl(profile.profilePicUrl)}
            alt="Profile"
            width="80"
            height="80"
            style={{ borderRadius: "50%", marginRight: "15px" }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <p><strong>Full Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
            <button onClick={handleDeleteProfile} style={{ marginLeft: "10px", backgroundColor: "#e74c3c", color: "white" }}>Delete Profile</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleEditProfile} style={{ marginBottom: "20px" }}>
          <input type="text" value={editedFirstName} onChange={(e) => setEditedFirstName(e.target.value)} placeholder="First Name" required />
          <input type="text" value={editedLastName} onChange={(e) => setEditedLastName(e.target.value)} placeholder="Last Name" required />
          <input type="file" accept="image/*" onChange={(e) => setEditedProfilePic(e.target.files[0])} />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditingProfile(false)} style={{ marginLeft: "10px" }}>Cancel</button>
        </form>
      )}

      {/* Skill Posts */}
      <section>
        <h3>Skill Posts</h3>
        {posts.length > 0 ? posts.map((post) => (
          <div key={post.id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>{post.description}</p>
              <div>
                <button onClick={() => setEditingPost({ ...post })} style={{ marginRight: "5px" }}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              </div>
            </div>
            {(post.mediaUrls || []).map((url, j) => (
              <img key={j} src={resolveUrl(url)} alt="media" width={150} style={{ marginRight: "5px" }} />
            ))}
            {editingPost?.id === post.id && (
              <form onSubmit={handleEditPost}>
                <textarea
                  value={editingPost.description}
                  onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                  rows="3"
                  style={{ width: "100%" }}
                />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setEditingFiles(e.target.files)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingPost(null)} style={{ marginLeft: "10px" }}>Cancel</button>
              </form>
            )}
          </div>
        )) : <p>No skill posts available.</p>}
      </section>

      <hr />

      {/* Learning Progress */}
      <section>
        <h3>Learning Progress</h3>
        {progress.length > 0 ? progress.map((item) => (
          <div key={item.id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>{item.message}</p>
              <div>
                <button onClick={() => setEditingProgress({ ...item })} style={{ marginRight: "5px" }}>Edit</button>
                <button onClick={() => handleDeleteProgress(item.id)}>Delete</button>
              </div>
            </div>
            {editingProgress?.id === item.id && (
              <div>
                <input
                  type="text"
                  value={editingProgress.message}
                  onChange={(e) => setEditingProgress({ ...editingProgress, message: e.target.value })}
                  style={{ width: "100%" }}
                />
                <button onClick={handleEditProgress}>Save</button>
              </div>
            )}
          </div>
        )) : <p>No learning progress updates yet.</p>}
      </section>

      <hr />

      {/* Learning Plans */}
      <section>
        <h3>Learning Plans</h3>
        {plans.length > 0 ? plans.map((p) => (
          <div key={p.id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p><strong>Topic:</strong> {p.topic}</p>
                <p><strong>Description:</strong> {p.resources}</p>
                <p><strong>Deadline:</strong> {p.deadline}</p>
              </div>
              <div>
                <button onClick={() => setEditingPlan({ ...p })} style={{ marginRight: "5px" }}>Edit</button>
                <button onClick={() => handleDeletePlan(p.id)}>Delete</button>
              </div>
            </div>
            {editingPlan?.id === p.id && (
              <div>
                <input
                  type="text"
                  value={editingPlan.topic}
                  onChange={(e) => setEditingPlan({ ...editingPlan, topic: e.target.value })}
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <input
                  type="text"
                  value={editingPlan.resources}
                  onChange={(e) => setEditingPlan({ ...editingPlan, resources: e.target.value })}
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <input
                  type="date"
                  value={editingPlan.deadline}
                  onChange={(e) => setEditingPlan({ ...editingPlan, deadline: e.target.value })}
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <button onClick={handleEditPlan}>Save</button>
              </div>
            )}
          </div>
        )) : <p>No learning plans found.</p>}
      </section>
    </div>
  );
}

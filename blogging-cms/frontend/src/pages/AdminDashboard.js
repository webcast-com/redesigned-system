import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/admin/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(userInfo).token}`,
          },
        };
        const { data } = await axios.get('/api/posts/admin/all', config);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/posts/${id}`, config);
        setPosts(posts.filter((post) => post._id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <Link to="/admin/post/new" style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#007bff', color: '#fff', textDecoration: 'none' }}>
            New Post
          </Link>
          <button onClick={logoutHandler} style={{ padding: '0.5rem 1rem' }}>Logout</button>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Title</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Published</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{post.title}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{post.published ? 'Yes' : 'No'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                <Link to={`/admin/post/edit/${post._id}`} style={{ marginRight: '1rem' }}>Edit</Link>
                <button onClick={() => deleteHandler(post._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

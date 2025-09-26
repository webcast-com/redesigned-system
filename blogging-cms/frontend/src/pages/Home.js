import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts');
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post._id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
              <h3>
                <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: '#333' }}>
                  {post.title}
                </Link>
              </h3>
              <p>{post.excerpt || post.content.substring(0, 150)}...</p>
              <small>By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

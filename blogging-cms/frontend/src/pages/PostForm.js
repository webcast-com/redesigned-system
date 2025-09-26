import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const { data } = await axios.get(`/api/posts/${id}`);
          setTitle(data.title);
          setContent(data.content);
          setExcerpt(data.excerpt || '');
          setTags(data.tags ? data.tags.join(', ') : '');
          setCategory(data.category || '');
          setPublished(data.published);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
      fetchPost();
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const postData = {
        title,
        content,
        excerpt,
        tags: tags.split(',').map((tag) => tag.trim()),
        category,
        published,
      };

      if (id) {
        await axios.put(`/api/posts/${id}`, postData, config);
      } else {
        await axios.post('/api/posts', postData, config);
      }

      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving post');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{id ? 'Edit Post' : 'New Post'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Excerpt:</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Content (HTML allowed):</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            {' '}Published
          </label>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {id ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;

// client/src/components/HomeFeed.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomeFeed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  // Fetch posts on load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts');
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchPosts();
  }, [user]);

  const handleCreatePost = async (imageFile) => {
    if (!newPost.trim() && !imageFile) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('content', newPost);
    formData.append('userId', user.id);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts([res.data, ...posts]);
      setNewPost('');
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-nexora-primary">Loading your feed...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      {/* Post Creation Box */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreatePost(imageFile);
        }}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-secondary focus:border-transparent"
            rows="3"
          />
          
          {imagePreview && (
            <div className="mt-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-64 rounded-lg object-cover w-full border border-gray-200"
              />
            </div>
          )}
          
          <div className="mt-3 flex justify-between items-center">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700">
              📷 Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />
            </label>
            
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-nexora-primary text-white rounded-lg hover:bg-nexora-secondary transition font-medium"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-nexora-primary flex items-center justify-center text-white font-bold mr-3">
                  {post.userId?.name?.[0] || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.userId?.name || 'Unknown'}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {post.content && (
                <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
              )}
              
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="mt-2">
                  <img 
                    src={post.mediaUrls[0]} 
                    alt="Post media" 
                    className="rounded-lg max-h-96 w-full object-contain border border-gray-100"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeFeed;
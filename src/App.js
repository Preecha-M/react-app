import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [replies, setReplies] = useState(() => {
    const savedReplies = localStorage.getItem('replies');
    return savedReplies ? JSON.parse(savedReplies) : {};
  });
  const [newReply, setNewReply] = useState({});
  const API_BASE_URL = "https://react-backend-2vkl.onrender.com"; // Backend URL

  useEffect(() => {
    fetchPosts();

    const interval = setInterval(() => {
      fetchPosts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        fetchReplies(post.id);
      });
    }
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('replies', JSON.stringify(replies));
  }, [replies]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/posts`, { content: newPost });
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleReplySubmit = async (postId) => {
    try {
      await axios.post(`${API_BASE_URL}/replies`, { postId, content: newReply[postId] });
      setNewReply({ ...newReply, [postId]: '' });
      fetchReplies(postId);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const fetchReplies = async (postId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/replies/${postId}`);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [postId]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  return (
    <div className="App">
      <div className="snow">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="snowflake">❄</div>
        ))}
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-red-500">
          🎄 Merry christmas kub🎅
        </h1>
        <div className="flex justify-center items-center my-6">
          <img
            src="https://example.com/christmas-tree-icon.png"
            alt="Christmas Tree"
            className="w-16 h-16"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="border p-2 w-full"
            placeholder="Write a new post..."
          />
          <button
            onClick={handlePostSubmit}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            Submit Post
          </button>
        </div>
        <div>
          {posts.map((post) => (
            <div key={post.id} className="border p-4 mb-4 rounded">
              <p>{post.content}</p>
              <div className="ml-4 mt-2">
                <h2 className="text-xl font-semibold">Replies</h2>
                <div>
                  {replies[post.id]?.map((reply) => (
                    <p key={reply.id} className="border-b p-2">{reply.content}</p>
                  ))}
                </div>
                <input
                  type="text"
                  value={newReply[post.id] || ''}
                  onChange={(e) =>
                    setNewReply({ ...newReply, [post.id]: e.target.value })
                  }
                  className="border p-2 w-full"
                  placeholder="Write a reply..."
                />
                <button
                  onClick={() => handleReplySubmit(post.id)}
                  className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
                >
                  Submit Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

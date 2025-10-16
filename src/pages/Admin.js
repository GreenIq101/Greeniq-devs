import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addBlog } from '../services/blogService';
import { generateBlogContent, generateTitleSuggestions, generateExcerpt } from '../services/aiService';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiLength, setAiLength] = useState('medium');
  const [generating, setGenerating] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState([]);

  // Simple password protection (in production, use proper authentication)
  const ADMIN_PASSWORD = 'darkhan';

  useEffect(() => {
    // Check if already authenticated in session
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  const handleGenerateTitles = async () => {
    if (!aiTopic.trim()) {
      setMessage('Please enter a topic for title generation.');
      return;
    }

    setGenerating(true);
    setMessage('');

    try {
      const suggestions = await generateTitleSuggestions(aiTopic);
      setTitleSuggestions(suggestions);
      setMessage('Title suggestions generated successfully!');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!aiTopic.trim()) {
      setMessage('Please enter a topic for content generation.');
      return;
    }

    setGenerating(true);
    setMessage('');

    try {
      const content = await generateBlogContent(aiTopic, aiTone, aiLength);
      const excerpt = await generateExcerpt(content);

      setFormData({
        ...formData,
        title: titleSuggestions[0] || `Sustainable Technology: ${aiTopic}`,
        content: content,
        excerpt: excerpt
      });

      setMessage('AI-generated content created successfully! Review and edit as needed.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleTitleSelect = (title) => {
    setFormData({
      ...formData,
      title: title
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await addBlog(formData);
      setMessage('Blog post added successfully!');
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: ''
      });
    } catch (error) {
      setMessage('Error adding blog post. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Header />
        <main className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card p-4">
                <h2 className="text-center mb-4">Admin Login</h2>
                {loginError && (
                  <div className="alert alert-danger" role="alert">
                    {loginError}
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Add New Blog Post</h1>
              <div>
                <Link to="/admin/analytics" className="btn btn-info me-2">
                  View Analytics
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                  Logout
                </button>
              </div>
            </div>
            {message && (
              <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                {message}
              </div>
            )}

            {/* AI Content Generation Section */}
            <div className="card p-4 mb-4">
              <h3 className="mb-3">AI Content Generator</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="aiTopic" className="form-label">Topic</label>
                    <input
                      type="text"
                      className="form-control"
                      id="aiTopic"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="e.g., Solar Energy Innovations"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="aiTone" className="form-label">Tone</label>
                    <select
                      className="form-select"
                      id="aiTone"
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="aiLength" className="form-label">Length</label>
                    <select
                      className="form-select"
                      id="aiLength"
                      value={aiLength}
                      onChange={(e) => setAiLength(e.target.value)}
                    >
                      <option value="short">Short (300-500 words)</option>
                      <option value="medium">Medium (600-800 words)</option>
                      <option value="long">Long (1000-1200 words)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mb-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleGenerateTitles}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Title Ideas'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerateContent}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Full Content'}
                </button>
              </div>
              {titleSuggestions.length > 0 && (
                <div className="mb-3">
                  <h5>Title Suggestions:</h5>
                  <div className="list-group">
                    {titleSuggestions.map((title, index) => (
                      <button
                        key={index}
                        type="button"
                        className="list-group-item list-group-item-action"
                        onClick={() => handleTitleSelect(title)}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="card p-4">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="excerpt" className="form-label">Excerpt</label>
                <textarea
                  className="form-control"
                  id="excerpt"
                  name="excerpt"
                  rows="3"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  rows="10"
                  value={formData.content}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="author" className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Adding...' : 'Add Blog Post'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
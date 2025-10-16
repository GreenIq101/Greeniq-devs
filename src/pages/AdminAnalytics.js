import React, { useState, useEffect } from 'react';
import { getBlogs } from '../services/blogService';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminAnalytics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simple password protection (same as Admin)
  const ADMIN_PASSWORD = 'darkhan';

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchAnalytics();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setLoginError('');
      fetchAnalytics();
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPassword('');
    setBlogs([]);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const blogData = await getBlogs();
      setBlogs(blogData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]); // Set empty array on error
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

  // Calculate analytics
  const totalBlogs = blogs.length;
  const authors = [...new Set(blogs.map(blog => blog.author))];
  const recentBlogs = blogs.slice(0, 5); // Last 5 blogs

  return (
    <div>
      <Header />
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Admin Analytics</h1>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Logout
              </button>
            </div>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : totalBlogs === 0 ? (
              <div className="alert alert-info text-center">
                <h4>No Blog Posts Yet</h4>
                <p>Start by adding some blog posts in the admin panel.</p>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-4">
                  <div className="card text-center p-3">
                    <h3>{totalBlogs}</h3>
                    <p>Total Blog Posts</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center p-3">
                    <h3>{authors.length}</h3>
                    <p>Unique Authors</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center p-3">
                    <h3>{recentBlogs.length}</h3>
                    <p>Recent Posts</p>
                  </div>
                </div>
              </div>
            )}
            {totalBlogs > 0 && (
              <div className="mt-5">
                <h2>Recent Blog Posts</h2>
                <div className="list-group">
                  {recentBlogs.map(blog => (
                    <div key={blog.id} className="list-group-item">
                      <h5>{blog.title}</h5>
                      <p>By {blog.author} on {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
                      <p>{blog.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAnalytics;
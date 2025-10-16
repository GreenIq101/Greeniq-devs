import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBlogs } from '../services/blogService';

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await getBlogs();
        setBlogPosts(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <Header />
      <main className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <h1 className="mb-4">Latest Blog Posts</h1>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : blogPosts.length === 0 ? (
              <p className="text-muted">No blog posts available yet.</p>
            ) : (
              blogPosts.map(post => (
                <div key={post.id} className="card mb-4">
                  <div className="card-body">
                    <h2 className="card-title">{post.title}</h2>
                    <p className="card-text">{post.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        By {post.author} on {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Unknown date'}
                      </small>
                      <button className="btn btn-outline-primary btn-sm">Read More</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">About Green IQ</h5>
                <p className="card-text">Welcome to Green IQ, where we share insights on sustainable technology, green innovations, and environmental solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
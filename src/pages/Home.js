import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBlogs } from '../services/blogService';

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await getBlogs();
        setBlogPosts(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Don't show error to user, just show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <Header />
      {/* Hero Section */}
      <section className="hero-section bg-gradient text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 slide-in-left">
              <div className="text-reveal">
                <h1 className="display-4 fw-bold mb-4">
                  Sustainable Technology & Green Innovations
                </h1>
              </div>
              <p className="lead mb-4 fade-in" style={{animationDelay: '0.5s'}}>
                Discover the latest insights on environmental solutions, sustainable technology,
                and green innovations that are shaping our future. Join us in building a
                more sustainable world through technology and innovation.
              </p>
              <div className="d-flex gap-3 fade-in" style={{animationDelay: '1s'}}>
                <a href="#blog-posts" className="btn btn-light btn-lg px-4 hover-lift">
                  Explore Articles
                </a>
                <a href="#about" className="btn btn-outline-light btn-lg px-4 hover-lift">
                  Learn More
                </a>
              </div>
            </div>
            <div className="col-lg-6 slide-in-right">
              <div className="hero-image-container">
                <img
                  src="/GreenIQ Logo With Text.png"
                  alt="Green IQ - Sustainable Technology & Green Innovations"
                  className="img-fluid hero-logo bounce-in"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container my-5" ref={ref}>
        <div className="row">
          <div className="col-lg-8">
            <h2 id="blog-posts" className={`mb-4 ${inView ? 'fade-in' : ''}`}>Latest Blog Posts</h2>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : blogPosts.length === 0 ? (
              <p className="text-muted">No blog posts available yet.</p>
            ) : (
              blogPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="card mb-4 hover-lift fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="card-body">
                    <h2 className="card-title">{post.title}</h2>
                    <p className="card-text">{post.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        By {post.author} on {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Unknown date'}
                      </small>
                      <button className="btn btn-outline-primary btn-sm hover-lift">Read More</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="col-lg-4">
            <div className="card hover-lift fade-in" style={{animationDelay: '1.5s'}}>
              <div className="card-body">
                <h5 className="card-title glow">About Green IQ</h5>
                <p className="card-text">Welcome to Green IQ, where we share insights on sustainable technology, green innovations, and environmental solutions.</p>
                <div className="mt-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-leaf text-success me-2"></i>
                    <span className="small">Sustainable Solutions</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    <span className="small">Innovative Ideas</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-globe text-info me-2"></i>
                    <span className="small">Global Impact</span>
                  </div>
                </div>
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
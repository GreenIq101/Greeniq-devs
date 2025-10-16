import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { generateNewsHeadlines, generateNewsDetail, askNewsQuestion } from '../services/aiService';

const News = () => {
  const { category } = useParams();
  const [newsItems, setNewsItems] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  const categories = {
    'sustainable-tech': 'Sustainable Technology',
    'green-energy': 'Green Energy',
    'climate-solutions': 'Climate Solutions',
    'eco-innovations': 'Eco-Innovations',
    'environmental-policy': 'Environmental Policy'
  };

  const currentCategory = category || 'sustainable-tech';

  useEffect(() => {
    loadNewsHeadlines();
  }, [currentCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadNewsHeadlines = async () => {
    setLoading(true);
    try {
      const headlines = await generateNewsHeadlines(currentCategory);
      setNewsItems(headlines);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNewsDetail = async (newsItem) => {
    setDetailLoading(true);
    try {
      const fullContent = await generateNewsDetail(newsItem.headline, newsItem.summary, newsItem.category);
      setSelectedNews({
        ...newsItem,
        fullContent
      });
      setQaHistory([]); // Reset Q&A when loading new article
    } catch (error) {
      console.error('Error loading news detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !selectedNews) return;

    setAsking(true);
    try {
      const answer = await askNewsQuestion(question, selectedNews.fullContent, selectedNews.headline);
      setQaHistory(prev => [...prev, {
        question: question.trim(),
        answer,
        timestamp: new Date()
      }]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      setQaHistory(prev => [...prev, {
        question: question.trim(),
        answer: 'Sorry, I couldn\'t answer that question right now. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setAsking(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <Header />
      <main className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Latest News - {categories[currentCategory]}</h1>
              <div className="btn-group" role="group">
                {Object.entries(categories).map(([key, name]) => (
                  <Link
                    key={key}
                    to={`/news/${key}`}
                    className={`btn ${key === currentCategory ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Generating latest news...</p>
              </div>
            ) : (
              <div className="row">
                {newsItems.map((item) => (
                  <div key={item.id} className="col-md-6 mb-4">
                    <div className="card h-100 hover-lift">
                      <div className="card-body">
                        <h5 className="card-title">
                          <button
                            className="btn btn-link p-0 text-decoration-none text-dark"
                            onClick={() => loadNewsDetail(item)}
                            style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                          >
                            {item.headline}
                          </button>
                        </h5>
                        <p className="card-text text-muted small">{item.summary}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {formatDate(item.publishedAt)}
                          </small>
                          <span className="badge bg-success">{categories[item.category]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            {selectedNews ? (
              <div className="card sticky-top" style={{ top: '20px' }}>
                <div className="card-header">
                  <h5 className="mb-0">Article Details</h5>
                </div>
                <div className="card-body">
                  <h6>{selectedNews.headline}</h6>
                  <p className="text-muted small mb-3">{selectedNews.summary}</p>

                  {detailLoading ? (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 small">Loading full article...</p>
                    </div>
                  ) : selectedNews.fullContent ? (
                    <div>
                      <div
                        className="article-content mb-4"
                        style={{
                          maxHeight: '400px',
                          overflowY: 'auto',
                          fontSize: '0.9rem',
                          lineHeight: '1.5'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: selectedNews.fullContent.replace(/\n/g, '<br>')
                        }}
                      />

                      <hr />
                      <h6>Ask Questions About This Article</h6>
                      <div className="mb-3">
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          placeholder="Ask anything about this news article..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAskQuestion();
                            }
                          }}
                        />
                        <button
                          className="btn btn-primary btn-sm mt-2 w-100"
                          onClick={handleAskQuestion}
                          disabled={asking || !question.trim()}
                        >
                          {asking ? 'Asking...' : 'Ask Question'}
                        </button>
                      </div>

                      {qaHistory.length > 0 && (
                        <div className="qa-history">
                          <h6 className="mb-3">Q&A History</h6>
                          {qaHistory.map((qa, index) => (
                            <div key={index} className="mb-3 p-2 border rounded">
                              <p className="mb-1"><strong>Q:</strong> {qa.question}</p>
                              <p className="mb-0 small text-muted"><strong>A:</strong> {qa.answer}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted small">Click on a headline to read the full article</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body text-center">
                  <h5>AI-Powered News</h5>
                  <p className="text-muted small">
                    Our AI generates the latest news in sustainable technology and green innovations.
                    Click on any headline to read the full article and ask questions about it.
                  </p>
                  <div className="mt-3">
                    <i className="fas fa-robot text-success" style={{ fontSize: '2rem' }}></i>
                  </div>
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

export default News;
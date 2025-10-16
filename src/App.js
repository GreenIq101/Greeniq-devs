import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminAnalytics from './pages/AdminAnalytics';
import News from './pages/News';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:category" element={<News />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

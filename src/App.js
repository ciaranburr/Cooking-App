import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import Suggestions from "./components/Suggestions"; // New component
import '@fortawesome/fontawesome-free/css/all.css';
import Home from "./components/Home"; 

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} /> {/* Define the Home component for root path */}
      <Route path='/suggestions' element={<Suggestions />} /> {/* Updated route */}
      </Routes>
    </Router>
    </>
  );
}

export default App;

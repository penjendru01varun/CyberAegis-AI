import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductWebsite from './ProductWebsite';
import axios from 'axios';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="app-container">
      <Navbar setView={setCurrentView} currentView={currentView} />
      
      <main style={{ paddingTop: '80px' }}>
        <ProductWebsite />
      </main>
    </div>
  );
}

export default App;

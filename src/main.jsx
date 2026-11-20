import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/andika/400.css';
import '@fontsource/andika/700.css';
import '@fontsource/lilita-one/400.css';
import '@fontsource-variable/nunito';
import './styles/base.css';
import './styles/home.css';
import './styles/worlds.css';
import './styles/player.css';
import './styles/extras.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

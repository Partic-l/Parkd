import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './home';
import Settings from './settings';
import Social from './social';
import NavBar from './NavBar';
import Login from './Login';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/social" element={<Social />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './home';
import Settings from './settings';
import Social from './social';
import NavBar from './NavBar';
import Login from './Login';
import './App.css';

function AppLayout() {
  const location = useLocation()
  const hideNav = location.pathname === '/login'

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/social" element={<Social />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
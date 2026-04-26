import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import DashBoard from './pages/DashBoard';
import { AuthProvider } from './context/AuthContext';

function AppLayout() {
  const location = useLocation();
  // Show navbar only on home page (not on login, register, or dashboard)
  // Dashboard has its own navbar built-in
  const showNavbar = location.pathname === '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import DashBoard from './pages/DashBoard';
import { AuthProvider } from './context/AuthContext';



function AppLayout() {
  const location = useLocation();
  const showNavbar = location.pathname === '/'; // Show only on home

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/register" element={<Register />} />
        {/* Add other routes */}
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
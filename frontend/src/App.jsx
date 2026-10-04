import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Landing from './pages/Landing'
import Readiness from './pages/Readiness'
import Register from './pages/Register'
import Passport from './pages/Passport'
import Login from './pages/Login'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0f1623',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.25)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0f1623' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#0f1623' } },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"         element={<Landing />} />
          <Route path="/readiness" element={<Readiness />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/passport"  element={<Passport />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/admin"     element={<Admin />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

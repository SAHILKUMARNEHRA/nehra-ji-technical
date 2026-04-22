import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Phones from './pages/Phones';
import PhoneDetail from './pages/PhoneDetail';
import Compare from './pages/Compare';
import Recommendation from './pages/Recommendation';
import TechNews from './pages/TechNews';
import Videos from './pages/Videos';
import Contact from './pages/Contact';
import Suggestions from './pages/Suggestions';
import ProcessorDetail from './pages/ProcessorDetail';
import Processors from './pages/Processors';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AdminLogin from './pages/Auth/AdminLogin';
import AdminDashboard from './pages/Admin/Dashboard';
import Cart from './pages/Cart';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/phones" element={<Phones />} />
            <Route path="/phones/:id" element={<PhoneDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/news" element={<TechNews />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/processors" element={<Processors />} />
            <Route path="/processors/:slug" element={<ProcessorDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

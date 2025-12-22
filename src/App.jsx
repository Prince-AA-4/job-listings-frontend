import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/SignUp.jsx';
import JobsList from './pages/Jobs.jsx';
import MyCompanies from './pages/MyCompanies.jsx';
import MyApplications from './pages/MyApplications.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserProfile from './pages/UserProfile.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Box>
          <Routes>
            {/* Home page with Hero section */}
            <Route path="/" element={<Home />} />
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Jobs page */}
            <Route path="/jobs" element={<JobsList />} /> 
            {/* Employer companies page */}
            <Route path="/my-companies" element={<MyCompanies />} />
            {/* Applicants applications */}
            <Route path="/my-applications" element={<MyApplications />} />
            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />
            {/* User Profile page  */}
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Box>
        <Footer/>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
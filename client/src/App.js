import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import DashBoard from './Pages/DashBoard';
import ProfilePage from './Pages/ProfilePage';
import ProjectsPage from './Pages/ProjectsPage';
import TeamsPage from './Pages/TeamsPage';
import TeamsListPage from './Pages/TeamsListPage';
import TeamMembersPage from './Pages/TeamMembersPage';

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the application with AuthProvider */}
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams-list" element={<TeamsListPage />} />
            <Route path="/team-members" element={<TeamMembersPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

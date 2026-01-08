import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the application with AuthProvider */}
        <div className="App">
          <Navbar />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

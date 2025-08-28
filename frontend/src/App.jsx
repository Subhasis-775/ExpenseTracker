import { Navigate } from 'react-router-dom';
import { useContext } from 'react'
import './App.css'
import { AuthContext } from './context/AuthContext'
import { Routes,Route } from 'react-router-dom';
import { Signup } from './pages/Signup.jsx';
import { Login } from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const {user}=useContext(AuthContext);
  return (
    <Routes>
      <Route path='/' element={user ?<Navigate to="/dashboard"/>:<Navigate to="/login"/>}/>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default App;

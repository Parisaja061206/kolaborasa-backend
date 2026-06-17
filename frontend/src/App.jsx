import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './Home'
import News from './News'
import Profile from './Profile'
import Login from './Login'
import Register from './Register'
import Landing from './Landing'
import Settings from './Settings'
import Dashboard from './pages/Dashboard'
import IdeEditForm from './pages/IdeEditForm'
import IdeList from './pages/IdeList'
import IdeForm from "./pages/IdeForm";
import IdeDetail from "./pages/IdeDetail";
import Komentar from "./pages/Komentar";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes inside Layout */}
        {/* <Route element={<Layout />}> */}
          <Route path="/home" element={<Home />} />
          <Route path="/ide" element={<IdeList />} />
          <Route path="/ide/tambah" element={<IdeForm />} />
          <Route path="/ide/:id" element={<IdeDetail />} />
          <Route path="/ide/:id/edit" element={<IdeEditForm />} />
          <Route path="/ide/:id/komentar" element={<Komentar />}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        {/* </Route> */}
      </Routes>
    </Router>
  )
}

export default App
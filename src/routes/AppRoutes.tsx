import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import CareerAnalysis from '../pages/CareerAnalysis/CareerAnalysis'
import Dashboard from '../pages/Dashboard/Dashboard'
import History from '../pages/History/History'
import Home from '../pages/Home/Home'
import Learning from '../pages/Learning/Learning'
import Login from '../pages/Login/Login'
import NotFound from '../pages/NotFound'
import Profile from '../pages/Profile/Profile'
import Register from '../pages/Register/Register'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with Top Nav and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes with Sidebar Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/career-analysis" element={<CareerAnalysis />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
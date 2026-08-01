import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'

// Public pages
import Home from '../pages/Home'

// Admin pages
import Login from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import ProjectForm from '../pages/admin/ProjectForm'
import Technologies from '../pages/admin/Technologies'
import Skills from '../pages/admin/Skills'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Admin login — no layout */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected admin routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/projects/new" element={<ProjectForm />} />
            <Route path="/admin/projects/:id" element={<ProjectForm />} />
            <Route path="/admin/technologies" element={<Technologies />} />
            <Route path="/admin/skills" element={<Skills />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

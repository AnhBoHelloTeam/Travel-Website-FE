import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '../modules/Home'
import { Login } from '../modules/auth/Login'
import { Register } from '../modules/auth/Register'
import { SchedulesSearch } from '../modules/schedules/SchedulesSearch'
import { ScheduleDetail } from '../modules/schedules/ScheduleDetail'
import { BookingFlow } from '../modules/booking/BookingFlow'
import { MyTickets } from '../modules/tickets/MyTickets'
import { AdminDashboard } from '../modules/admin/AdminDashboard'
import { BusinessDashboard } from '../modules/business/BusinessDashboard'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/schedules" element={<SchedulesSearch />} />
      <Route path="/schedules/:id" element={<ScheduleDetail />} />
      
      {/* Protected Routes - Require Authentication */}
      <Route path="/booking/:scheduleId" element={
        <ProtectedRoute>
          <BookingFlow />
        </ProtectedRoute>
      } />
      <Route path="/mytickets" element={
        <ProtectedRoute>
          <MyTickets />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes - Require Admin Role */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Business Routes - Require Business Role */}
      <Route path="/business" element={
        <ProtectedRoute requiredRole="business">
          <BusinessDashboard />
        </ProtectedRoute>
      } />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

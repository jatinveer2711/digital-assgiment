import React from 'react'
import Signup from './pages/Signup.jsx'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './pages/Login.jsx'
import Teacher from './pages/Teacher.jsx'
import Student from './pages/studentDashbaord.jsx'
import Sumbission from './pages/Sumbission.jsx'
import ProtectedRoute from './component/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  return (
  
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/teacher' element={<ProtectedRoute><Teacher/></ProtectedRoute>}/>
          <Route path='/student' element={<ProtectedRoute><Student/></ProtectedRoute>}/>
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path='/sumbission' element={<ProtectedRoute><Sumbission/></ProtectedRoute>}/>
        </Routes>
      </Router>

    
  )
}

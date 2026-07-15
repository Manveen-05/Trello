import './App.css'
import { Dashboard } from './screens/dashboard'
import { Board } from './screens/board'
import { Auth } from './screens/auth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/board/:id" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

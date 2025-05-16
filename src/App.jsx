import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import CreatePost from './Page/CreatePost'
import Profile from './Page/Profile'
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CreatePost />} />
        <Route path="/student-profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  )
}

export default App
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import InvitationDetail from './pages/InvitationDetail';
import Invitation from './pages/Invitation';
import InvitationPreview from './pages/InvitationPreview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/invitation/:id" element={<InvitationDetail />} />
        <Route path="/invitation" element={<Invitation />} />
        <Route path="/invitation/preview" element={<InvitationPreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
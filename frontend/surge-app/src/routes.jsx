// routes.js
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import { RequireAuth } from 'react-auth-kit'

import Home from './pages/Home'; // Import your page components
import About from './pages/About';
import AuthPage from './pages/AuthPage';

const RouteComponent = () => (
    <BrowserRouter>
    <Routes >
          
            <Route path="/home" element={
                <RequireAuth loginPath="/auth">
                    <Home />
                </RequireAuth>
            } /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/auth" element={<AuthPage />} /> 
        <Route path="/profile" element={<AuthPage />} /> 
    
         
    </Routes >
    </BrowserRouter>
);

export default RouteComponent;
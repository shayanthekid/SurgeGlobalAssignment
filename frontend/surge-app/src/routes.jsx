// routes.js
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import { RequireAuth } from 'react-auth-kit'

import Home from './pages/Home'; // Import your page components
import About from './pages/About';

const RouteComponent = () => (
    <BrowserRouter>
    <Routes >
          
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} /> 
            <Route path={'/secure'} element={
                <RequireAuth loginPath={'/'}>
                    <div>
                        Secure
                    </div>
                </RequireAuth>
            } />
        {/* Add more routes as needed */}
         
    </Routes >
    </BrowserRouter>
);

export default RouteComponent;
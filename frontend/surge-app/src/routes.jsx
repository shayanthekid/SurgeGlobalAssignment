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
          
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/auth" element={<AuthPage />} /> 
            <Route path={'/secure'} element={
                //make this the listing page/home page. should redirect to login component
                <RequireAuth loginPath={'/auth'}>
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
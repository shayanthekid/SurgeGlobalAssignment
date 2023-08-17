import { useState } from 'react'
import { AuthProvider } from 'react-auth-kit'
import RouteComponent from './routes';



const App = () => (
  <AuthProvider authType={'cookie'}
    authName={'_auth'}
    cookieDomain={window.location.hostname}
    cookieSecure={window.location.protocol === "https:"}>
    <RouteComponent />
  </AuthProvider>
);

export default App

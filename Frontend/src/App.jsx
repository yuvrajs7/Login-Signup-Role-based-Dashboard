import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FormContainer from './FormContainer';
import Created from './usercreated';
import Dashboard from './dashboard';
import ProtectedRoute from './protectedroutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FormContainer />
  },
  {
    path: '/login',
    element: <FormContainer /> // or a separate Login page
  },
  {
    path: '/signup',
    element: <FormContainer /> // or a separate SignUp page
  },
  {
    path: '/usercreated',
    element: <Created />
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <div style={{ padding: '2rem' }}>404 - Page Not Found</div>
  }
]);



function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

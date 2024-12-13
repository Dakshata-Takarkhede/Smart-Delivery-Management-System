import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import AllOrders from "./pages/AllOrders.jsx";
import AllPartners from './pages/AllPartners.jsx';
import Assignments from './pages/Assignments.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Parent layout component
    children: [
      {
        path: "",
        element: <LoginPage />, // Landing Page or redirect to Login
      },
      {
        path: "/user/register",
        element: <RegisterPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />, // Dashboard with overview metrics
      },
      {
        path: "/orders",
        element: <AllOrders />, // List all orders
      },
      {
        path: "/partners",
        element: <AllPartners />, // List all delivery partners
      },
      {
        path: "/assignments",
        element: <Assignments />, // View all assignments
      },
    ],
  },
]);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <RouterProvider router={router} />
    {/* </Provider> */}
  </React.StrictMode>
);

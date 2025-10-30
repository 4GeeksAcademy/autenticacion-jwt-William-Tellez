// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route, Navigate
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import Home from './pages/Home';
import Exercises from "./pages/Exercises";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <>
      {/* Rutas con Layout (Navbar + Footer) */}
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

        {/* Rutas privadas para user y admin */}
        <Route element={<PrivateRoute allowedRoles={['user', 'admin', 'superadmin']} />}>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<Exercises />} />
        </Route>

        {/* Ruta solo para admin */}
        <Route element={<PrivateRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* Rutas públicas */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </>
  )
);
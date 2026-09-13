import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Logout from "./pages/Logout";

import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import ProductCreate from "./includes/product/ProductCreate";

import Users from "./includes/users/Users";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ProductEdit from "./includes/product/ProductEdit";
import Category from "./pages/Category";
import Banner from "./pages/Banner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />

        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<Login />} />
        </Route>

        <Route path="/logout" element={<Logout />} />

        <Route element={<ProtectedRoute />}>  
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/banners" element={<Banner/>}/>
            <Route path="/products" element={<Product />} />
            <Route path="/products/create" element={<ProductCreate />} />
            <Route path="/products/edit/:id" element={<ProductEdit />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

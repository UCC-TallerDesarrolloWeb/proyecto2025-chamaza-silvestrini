import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import Layout from "@components/Layout";
import Home from "@pages/Home";
import Tienda from "@pages/Tienda";
import Login from "@pages/Login";
import Recetas from "@pages/Recetas";
import Privacidad from "@pages/Privacidad";
import Condiciones from "@pages/Condiciones";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tienda" element={<Tienda />} />
            <Route path="login" element={<Login />} />
            <Route path="recetas" element={<Recetas />} />
            <Route path="privacidad" element={<Privacidad />} />
            <Route path="condiciones" element={<Condiciones />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

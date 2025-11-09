import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@components/Layout";
import Home from "@pages/Home";
import Tienda from "@pages/Tienda";
import Login from "@pages/Login";
import "@styles/index.scss";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Tienda />} />
          <Route path="login" element={<Login />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

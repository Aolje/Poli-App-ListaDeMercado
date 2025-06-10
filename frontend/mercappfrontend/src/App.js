import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { CheckoutPage } from "./pages/CheckoutPage";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/prueba`)
      .then((res) => res.text())
      .then((data) => setMensaje(data))
      .catch((err) => setMensaje("Error al conectar con el backend"));
  }, []);

  console.log(mensaje);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;

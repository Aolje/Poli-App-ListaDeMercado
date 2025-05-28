import React, { useEffect, useState } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/prueba`)
      .then((res) => res.text()) // Si tu endpoint devuelve texto. Usa .json() si es JSON
      .then((data) => setMensaje(data))
      .catch((err) => setMensaje('Error al conectar con el backend'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React App</h1>
      <h2>Respuesta desde Spring Boot:</h2>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;
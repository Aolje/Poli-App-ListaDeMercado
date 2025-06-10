import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const products = location.state?.selectedProducts || [];
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGoHome = () => {
    navigate("/", {
      state: {
        selectedProducts: products,
        checkedItems: checkedItems,
      },
    });
  };

  return (
    <div className="cp-container">
      <h1>Lista de productos</h1>
      <ul className="cp-pl">
        {products.map((p) => (
          <li
            key={p.id}
            onClick={() => toggleCheck(p.id)}
            className={checkedItems.includes(p.id) ? "checked" : ""}
          >
            {p.name} - {p.price}
          </li>
        ))}
      </ul>
      <button onClick={handleGoHome}>Volver al inicio</button>
    </div>
  );
}

export { CheckoutPage };

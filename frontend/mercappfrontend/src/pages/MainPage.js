import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { ProductList } from "../components/ProductList";
import { SelectedList } from "../components/SelectedList";
import { PRODUCTS } from "../mocks/products";
import "./MainPage.css";

function MainPage() {
  const [filterText, setFilterText] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleAdd = (product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemove = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const handleFinish = () => {
    navigate("/checkout", { state: { selectedProducts } });
  };

  return (
    <div className="main-page">
      <div className="header">
        <h1 className="main-title">Mercapp</h1>
        <SearchBar filterText={filterText} onFilterChange={setFilterText} />
      </div>
      <div className="lists-container">
        <div className="products-container">
          <h2>Productos</h2>
          <ProductList products={filteredProducts} onAdd={handleAdd} />
        </div>
        <div className="selected-container">
          <h2>Seleccionados</h2>
          <SelectedList
            selectedProducts={selectedProducts}
            onRemove={handleRemove}
          />
        </div>
      </div>
      <button className="btn-finish" onClick={handleFinish}>
        Finalizar lista
      </button>
    </div>
  );
}

export { MainPage };

import "./ProductList.css";

const categoryColors = {
  Bebidas: "#1f77b4",
  Carnes: "#ff7f0e",
  Congelados: "#2ca02c",
  Cuidado_Personal: "#d62728",
  Despensa: "#9467bd",
  Dulces: "#8c564b",
  Embutidos: "#e377c2",
  Enlatados: "#7f7f7f",
  Frutas: "#bcbd22",
  Limpieza: "#17becf",
  Lácteos: "#aec7e8",
  Panadería: "#ffbb78",
  Pescados: "#98df8a",
  Verduras: "#ff9896",
};

function ProductList({ products, onAdd }) {
  return (
    <ul className="product-list">
      {products.map((p) => {
        const cleanPrice = p.price.replace(/[^0-9.]/g, "");
        const priceNumber = parseFloat(cleanPrice);
        const categoryColor = categoryColors[p.category] || "#000";

        return (
          <li
            key={p.id}
            onClick={() => onAdd(p)}
            className="product-list-item"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter") onAdd(p);
            }}
          >
            <div className="product-id">
              <span className="product-name">{p.name}</span>
              <span
                className="product-category"
                style={{ color: categoryColor }}
              >
                {p.category}
              </span>
            </div>
            <span className="product-price">
              ${!isNaN(priceNumber) ? priceNumber.toFixed(2) : "0.00"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export { ProductList };

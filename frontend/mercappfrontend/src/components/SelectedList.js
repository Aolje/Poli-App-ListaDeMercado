import "./SelectedList.css";
function SelectedList({ selectedProducts, onRemove }) {
  return (
    <ul className="selected-list">
      {selectedProducts.map((p) => (
        <li key={p.id} className="selected-list-item">
          <span className="product-info">
            {p.name} -{" "}
            <span className="product-price">
              {(() => {
                const cleanPrice = p.price.replace(/[^0-9.]/g, "");
                const priceNumber = parseFloat(cleanPrice);
                return `$${
                  !isNaN(priceNumber) ? priceNumber.toFixed(2) : "0.00"
                }`;
              })()}
            </span>
          </span>
          <button className="btn-delete" onClick={() => onRemove(p.id)}>
            Borrar
          </button>
        </li>
      ))}
    </ul>
  );
}

export { SelectedList };

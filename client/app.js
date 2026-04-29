const { useState, useEffect } = React;

const PRODUCT_DATA = {
  pencils: [
    { name: "Mechanical Pencil", price: "$5", image: "images/mechanical_pencil.jpeg" },
    { name: "Color Pencil Set", price: "$3", image: "images/color_pensilset.jpeg" },
    { name: "Drawing Pencil Kit", price: "$8", image: "images/drawing_pencilkit.jpeg" }
  ],
  pens: [
    { name: "Gel Pen", price: "$3", image: "images/gel_pen.jpeg" },
    { name: "Blue Ink Pen", price: "$5", image: "images/blueink_pen.jpeg" },
    { name: "Red Ink Pen", price: "$6", image: "images/redink_pen.jpeg" }
  ],
  calculators: [
    { name: "Basic Calculator", price: "$10", image: "images/basic_calculator.jpeg" },
    { name: "Scientific Calculator", price: "$20", image: "images/scientific_calculator.jpeg" },
    { name: "Graphing Calculator", price: "$50", image: "images/graphing_calculator.jpeg" },
    { name: "Solar Calculator", price: "$15", image: "images/solar_calculator.jpeg" },
    { name: "Financial Calculator", price: "$30", image: "images/financial_calculator.jpeg" },
    { name: "Mini Pocket Calculator", price: "$8", image: "images/mini-pocket_calculator.jpeg" }
  ],
  erasers: [
    { name: "Kneaded Eraser", price: "$2", image: "images/kneaded_eraser.jpeg" },
    { name: "Art Eraser Set", price: "$4", image: "images/art_eraserset.jpeg" },
    { name: "Mini Erasers Pack", price: "$2.5", image: "images/mini_eraserspack.jpeg" },
    { name: "Dust-Free Eraser", price: "$3", image: "images/dust-free_eraser.jpeg" }
  ],
  notebooks: [
    { name: "Spiral Notebook", price: "$3", image: "images/spiral_notebook.jpeg" },
    { name: "Composition Notebook", price: "$2.5", image: "images/composition_notebook.jpeg" },
    { name: "Hardcover Notebook", price: "$6", image: "images/hardcover_notebook.jpeg" },
    { name: "Mini Notebook", price: "$2", image: "images/mini_notebook.jpeg" },
    { name: "College Ruled Notebook", price: "$3.5", image: "images/college-ruled_notebook.jpeg" }
  ],
  rulers: [
    { name: "Plastic Ruler", price: "$2", image: "images/plastic_ruler.jpeg" },
    { name: "Metal Ruler", price: "$5", image: "images/metal_ruler.jpeg" },
    { name: "Flexible Ruler", price: "$3", image: "images/flexible_ruler.jpeg" }
  ]
};

function CategoryButton({ category, onSelect }) {
  const colorMap = {
    pencils: "#ff9800",
    pens: "#2196f3",
    calculators: "#9c27b0",
    erasers: "#f44336",
    notebooks: "#009688",
    rulers: "#795548"
  };

  return (
    <button
      onClick={() => onSelect(category)}
      style={{ background: colorMap[category.name.toLowerCase()] || "#333" }}
      id={category.name.toLowerCase()}
    >
      {category.name}
    </button>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to load categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Unable to load categories");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const selectedProducts = selectedCategory
    ? PRODUCT_DATA[selectedCategory.name.toLowerCase()] || []
    : [];

  return (
    <div>
      <h1>Stationery Store</h1>

      {selectedCategory ? (
        <div>
          <button onClick={handleBack} style={{ marginBottom: "20px" }}>
            ← Back to Categories
          </button>
          <h2>{selectedCategory.name}</h2>
          <div className="products">
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))
            ) : (
              <p>No products available for this category.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <label>Categories</label>
          {loading && <p>Loading categories...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && (
            <div id="category-container" className="categories">
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  onSelect={handleCategorySelect}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

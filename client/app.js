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

const CATEGORY_COLORS = {
  pencils: "#f59e0b",
  pens: "#2563eb",
  calculators: "#7c3aed",
  erasers: "#dc2626",
  notebooks: "#059669",
  rulers: "#92400e"
};

function LoginView({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  function handleSignup(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const user = {
      name: form.get("name").trim(),
      email: form.get("email").trim(),
      password: form.get("password")
    };

    if (!user.name || !user.email || !user.password) {
      setMessage("Fill all fields.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    setMessage("Account created. Sign in to continue.");
    setMode("login");
  }

  function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email").trim();
    const password = form.get("password");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setMessage("No account found. Create one first.");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      setMessage("");
      onLogin(storedUser);
      return;
    }

    setMessage("Invalid login.");
  }

  return (
    <main className="login-layout">
      <section className="login-info">
        <div className="brand">SchoolMart</div>
        <h1>Everything you need for academic success</h1>
        <p>From notebooks to calculators, shop school essentials in one place.</p>
        <div className="features">
          <span>Free shipping</span>
          <span>Secure checkout</span>
          <span>Easy returns</span>
          <span>Student support</span>
        </div>
      </section>

      <section className="auth-panel" aria-label="Authentication">
        <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p className="subtitle">
          {mode === "login" ? "Sign in to continue" : "Start shopping faster"}
        </p>

        <div className="tabs">
          <button
            type="button"
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "tab active" : "tab"}
            onClick={() => setMode("signup")}
          >
            Create Account
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="auth-form">
            <input name="email" type="email" placeholder="Email" />
            <input name="password" type="password" placeholder="Password" />
            <button type="submit" className="primary-btn">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <input name="name" type="text" placeholder="Full Name" />
            <input name="email" type="email" placeholder="Email" />
            <input name="password" type="password" placeholder="Password" />
            <button type="submit" className="primary-btn">Create Account</button>
          </form>
        )}

        {message && <p className="form-message">{message}</p>}
      </section>
    </main>
  );
}

function CategoryButton({ category, onSelect }) {
  const categoryKey = category.name.toLowerCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      style={{ background: CATEGORY_COLORS[categoryKey] || "#334155" }}
      id={categoryKey}
      className="category-button"
    >
      {category.name}
    </button>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <button type="button" onClick={() => onAdd(product)}>
        Add to Cart
      </button>
    </article>
  );
}

function StoreView({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartCount, setCartCount] = useState(0);
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

  const selectedProducts = selectedCategory
    ? PRODUCT_DATA[selectedCategory.name.toLowerCase()] || []
    : [];

  return (
    <main className="store-shell">
      <header className="store-header">
        <div>
          <p className="eyebrow">SchoolMart</p>
          <h1>Stationery Store</h1>
        </div>
        <div className="header-actions">
          <span className="cart-count">Cart: {cartCount}</span>
          <span className="user-name">{user.name}</span>
          <button type="button" className="secondary-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {selectedCategory ? (
        <section>
          <div className="section-heading">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setSelectedCategory(null)}
            >
              Back to Categories
            </button>
            <h2>{selectedCategory.name}</h2>
          </div>
          <div className="products">
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  onAdd={() => setCartCount((count) => count + 1)}
                />
              ))
            ) : (
              <p>No products available for this category.</p>
            )}
          </div>
        </section>
      ) : (
        <section>
          <div className="section-heading">
            <h2>Categories</h2>
          </div>
          {loading && <p>Loading categories...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <div id="category-container" className="categories">
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  onSelect={setSelectedCategory}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser"));
  });

  function handleLogin(nextUser) {
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    setUser(null);
  }

  return user ? (
    <StoreView user={user} onLogout={handleLogout} />
  ) : (
    <LoginView onLogin={handleLogin} />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

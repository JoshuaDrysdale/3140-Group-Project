const { useState, useEffect } = React;

const CLOUDINARY_CONFIG = {
  cloudName: "",
  folder: "schoolmart-products",
  transformations: "f_auto,q_auto,w_500"
};

function getImageUrl(fileName) {
  if (!CLOUDINARY_CONFIG.cloudName) {
    return `images/${fileName}`;
  }

  const folderPath = CLOUDINARY_CONFIG.folder ? `${CLOUDINARY_CONFIG.folder}/` : "";

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${CLOUDINARY_CONFIG.transformations}/${folderPath}${fileName}`;
}

const PRODUCT_DATA = {
  pencils: [
    { name: "Mechanical Pencil", price: "$5", image: "mechanical_pencil.jpeg" },
    { name: "Color Pencil Set", price: "$3", image: "color_pensilset.jpeg" },
    { name: "Drawing Pencil Kit", price: "$8", image: "drawing_pencilkit.jpeg" }
  ],
  pens: [
    { name: "Gel Pen", price: "$3", image: "gel_pen.jpeg" },
    { name: "Blue Ink Pen", price: "$5", image: "blueink_pen.jpeg" },
    { name: "Red Ink Pen", price: "$6", image: "redink_pen.jpeg" }
  ],
  calculators: [
    { name: "Basic Calculator", price: "$10", image: "basic_calculator.jpeg" },
    { name: "Scientific Calculator", price: "$20", image: "scientific_calculator.jpeg" },
    { name: "Graphing Calculator", price: "$50", image: "graphing_calculator.jpeg" },
    { name: "Solar Calculator", price: "$15", image: "solar_calculator.jpeg" },
    { name: "Financial Calculator", price: "$30", image: "financial_calculator.jpeg" },
    { name: "Mini Pocket Calculator", price: "$8", image: "mini-pocket_calculator.jpeg" }
  ],
  erasers: [
    { name: "Kneaded Eraser", price: "$2", image: "kneaded_eraser.jpeg" },
    { name: "Art Eraser Set", price: "$4", image: "art_eraserset.jpeg" },
    { name: "Mini Erasers Pack", price: "$2.5", image: "mini_eraserspack.jpeg" },
    { name: "Dust-Free Eraser", price: "$3", image: "dust-free_eraser.jpeg" }
  ],
  notebooks: [
    { name: "Spiral Notebook", price: "$3", image: "spiral_notebook.jpeg" },
    { name: "Composition Notebook", price: "$2.5", image: "composition_notebook.jpeg" },
    { name: "Hardcover Notebook", price: "$6", image: "hardcover_notebook.jpeg" },
    { name: "Mini Notebook", price: "$2", image: "mini_notebook.jpeg" },
    { name: "College Ruled Notebook", price: "$3.5", image: "college-ruled_notebook.jpeg" }
  ],
  rulers: [
    { name: "Plastic Ruler", price: "$2", image: "plastic_ruler.jpeg" },
    { name: "Metal Ruler", price: "$5", image: "metal_ruler.jpeg" },
    { name: "Flexible Ruler", price: "$3", image: "flexible_ruler.jpeg" }
  ]
};

const CATEGORY_LABELS = {
  pencils: "Pencils",
  pens: "Pens",
  calculators: "Calculators",
  erasers: "Erasers",
  notebooks: "Notebooks",
  rulers: "Rulers"
};

function getProductList() {
  return Object.entries(PRODUCT_DATA).flatMap(([category, products]) =>
    products.map((product, index) => ({
      ...product,
      category,
      categoryLabel: CATEGORY_LABELS[category],
      id: `${category}-${product.name.toLowerCase().replaceAll(" ", "-")}`,
      image: getImageUrl(product.image),
      rating: (4.4 + ((index + category.length) % 5) / 10).toFixed(1),
      reviews: 80 + category.length * 14 + index * 31,
      badge: index === 0 ? "Best Seller" : index === 1 ? "Student Pick" : "Fast Ship"
    }))
  );
}

function parsePrice(price) {
  return Number(price.replace("$", ""));
}

function formatMoney(value) {
  return `$${value.toFixed(2).replace(".00", "")}`;
}

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
    <main className="login-page">
      <section className="left">
        <div className="logo">SchoolMart</div>

        <h1>Everything you need<br />for academic success</h1>

        <p className="desc">
          From textbooks to tech, notebooks to backpacks.
          Your one-stop shop for all school essentials.
        </p>

        <div className="features">
          <div className="feature">Free Shipping</div>
          <div className="feature">Secure Checkout</div>
          <div className="feature">Easy Returns</div>
          <div className="feature">24/7 Support</div>
        </div>
      </section>

      <section className="right">
        <div className="card">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to continue</p>

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
              <button type="submit" className="main-btn">Sign In</button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="auth-form">
              <input name="name" type="text" placeholder="Full Name" />
              <input name="email" type="email" placeholder="Email" />
              <input name="password" type="password" placeholder="Password" />
              <button type="submit" className="main-btn">Create Account</button>
            </form>
          )}

          <p className="divider">OR CONTINUE WITH</p>

          <div className="socials">
            <button type="button" className="social-btn">
              Google
            </button>
          </div>

          {message && <p className="form-message">{message}</p>}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-media">
        <span className="product-badge">{product.badge}</span>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <p className="product-category">{product.categoryLabel}</p>
        <h3>{product.name}</h3>
        <div className="rating-row">
          <span className="stars">5 stars</span>
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <p className="shipping">Free delivery with SchoolMart Plus</p>
        <div className="buy-row">
          <p className="price">{product.price}</p>
          <button type="button" onClick={() => onAdd(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

function StoreView({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const products = getProductList();

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to load categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Using local categories while the database is unavailable.");
        setCategories(
          Object.keys(PRODUCT_DATA).map((key) => ({
            id: key,
            name: CATEGORY_LABELS[key]
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  function addToCart(product) {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const searchText = `${product.name} ${product.categoryLabel}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <main className="shop-page">
      <header className="shop-header">
        <button type="button" className="logo-button" onClick={() => setActiveCategory("all")}>
          SchoolMart
        </button>

        <div className="search-wrap">
          <select
            aria-label="Category"
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
          >
            <option value="all">All</option>
            {categories.map((category) => {
              const key = category.name.toLowerCase();
              return (
                <option key={category.id} value={key}>
                  {category.name}
                </option>
              );
            })}
          </select>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search pencils, notebooks, calculators"
          />
          <button type="button" className="search-btn">Search</button>
        </div>

        <div className="account-actions">
          <div className="account-copy">
            <span>Hello, {user.name}</span>
            <button type="button" onClick={onLogout}>Sign Out</button>
          </div>
          <div className="cart-pill">
            <span>{cartCount}</span>
            <strong>Cart</strong>
          </div>
        </div>
      </header>

      <nav className="category-nav" aria-label="Shop categories">
        <button
          type="button"
          className={activeCategory === "all" ? "active" : ""}
          onClick={() => setActiveCategory("all")}
        >
          All Departments
        </button>
        {categories.map((category) => {
          const key = category.name.toLowerCase();
          return (
            <button
              type="button"
              key={category.id}
              className={activeCategory === key ? "active" : ""}
              onClick={() => setActiveCategory(key)}
            >
              {category.name}
            </button>
          );
        })}
      </nav>

      <section className="promo-banner">
        <div>
          <p>Back-to-school event</p>
          <h1>Build your perfect class kit.</h1>
          <span>Save on writing tools, notebooks, calculators, and desk basics.</span>
        </div>
        <img src={getImageUrl("spiral_notebook.jpeg")} alt="Spiral notebook" />
      </section>

      {error && <p className="soft-alert">{error}</p>}

      <section className="shop-layout">
        <aside className="sidebar">
          <h2>Departments</h2>
          <button
            type="button"
            className={activeCategory === "all" ? "active" : ""}
            onClick={() => setActiveCategory("all")}
          >
            All Products
          </button>
          {categories.map((category) => {
            const key = category.name.toLowerCase();
            return (
              <button
                type="button"
                key={category.id}
                className={activeCategory === key ? "active" : ""}
                onClick={() => setActiveCategory(key)}
              >
                {category.name}
              </button>
            );
          })}
        </aside>

        <section className="product-section">
          <div className="section-bar">
            <div>
              <p>{loading ? "Loading products" : `${filteredProducts.length} products`}</p>
              <h2>
                {activeCategory === "all" ? "Featured supplies" : CATEGORY_LABELS[activeCategory]}
              </h2>
            </div>
            <span>Sorted by Featured</span>
          </div>

          <div className="products">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))
            ) : (
              <p className="empty-state">No products match your search.</p>
            )}
          </div>
        </section>

        <aside className="cart-summary">
          <h2>Cart Summary</h2>
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <div className="cart-list">
              {cartItems.slice(0, 4).map((item) => (
                <div className="cart-line" key={item.id}>
                  <span>{item.quantity}x</span>
                  <p>{item.name}</p>
                  <strong>{formatMoney(parsePrice(item.price) * item.quantity)}</strong>
                </div>
              ))}
            </div>
          )}
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatMoney(cartTotal)}</strong>
          </div>
          <button type="button" className="checkout-btn" disabled={cartItems.length === 0}>
            Checkout
          </button>
        </aside>
      </section>
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

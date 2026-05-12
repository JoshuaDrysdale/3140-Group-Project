import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import './Store.css';
import ProductModal from './ProductModal';

export default function Store({ onAddToCart, searchQuery, onSearchChange }) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();

        const productsWithRatings = await Promise.all(
          data.map(async (product) => {
            const reviewRes = await fetch(`/api/reviews/${product.id}`);
            const reviews = await reviewRes.json();

            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
                : 0;

            return {
              ...product,
              averageRating,
              reviewCount: reviews.length
            };
          })
        );

        setProducts(productsWithRatings);
      } catch (error) {
        console.error('Failed to fetch all products', error);
        setProductError('Unable to load products right now.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const names = products.map((product) => product.category).filter(Boolean);
    return ['all', ...new Set(names)];
  }, [products]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const visibleProducts = products
    .filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const searchText = `${product.name} ${product.category || ''}`.toLowerCase();
      const matchesSearch = normalizedSearch === '' || searchText.includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return (b.averageRating || 0) - (a.averageRating || 0);
      if (sortBy === 'rating-asc') return (a.averageRating || 0) - (b.averageRating || 0);
      return 0;
    });

  return (
    <div className="store">
      <section className="store-section product-showcase">
        <div className="section-heading product-heading">
          <div>
            <p className="section-kicker">All products</p>
            <h2 className="store-section-title">Shop the full shelf</h2>
          </div>
          {products.length > 0 && (
            <span className="product-count">{visibleProducts.length} items</span>
          )}
        </div>

        {normalizedSearch && (
          <div className="search-summary">
            <span>Search results for <strong>{searchQuery.trim()}</strong></span>
            <button type="button" onClick={() => onSearchChange('')}>Clear</button>
          </div>
        )}

        {categories.length > 1 && (
          <div className="product-filter" aria-label="Filter products by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

        )}

        <div className="sort-control">
          <button onClick={() => setSortBy('default')} className={sortBy === 'default' ? 'active' : ''}>Default</button>
          <button onClick={() => setSortBy('price-asc')} className={sortBy === 'price-asc' ? 'active' : ''}>Price: Low to High</button>
          <button onClick={() => setSortBy('price-desc')} className={sortBy === 'price-desc' ? 'active' : ''}>Price: High to Low</button>
          <button onClick={() => setSortBy('rating-desc')} className={sortBy === 'rating-desc' ? 'active' : ''}>Top Rated</button>
        </div>

        {loadingProducts && <p className="page-state">Loading the shelf...</p>}
        {productError && <p className="page-state">{productError}</p>}
        {!loadingProducts && !productError && visibleProducts.length === 0 && (
          <p className="page-state">No products found. Try a different search or category.</p>
        )}
        {!loadingProducts && !productError && visibleProducts.length > 0 && (
          <>
            <div className="products">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewProduct={setSelectedProduct}
                />
              ))}
            </div>

            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={onAddToCart}
            />
          </>
        )}
      </section>

      <section className="store-support">
        <div className="store-banner" aria-label="SchoolMart featured shopping area">
          <div className="banner-copy">
            <p className="banner-kicker">Back-to-school drop</p>
            <h2>Build your school bag in one scroll.</h2>
            <p>
              Browse every product on the main page, then use filters when you know exactly what you need.
            </p>
          </div>
          <div className="banner-visual" aria-hidden="true">
            <div className="deal-card primary">
              <span>Today</span>
              <strong>Study kits</strong>
            </div>
            <div className="deal-card accent">
              <span>New</span>
              <strong>Tech picks</strong>
            </div>
            <div className="deal-card warm">
              <span>Fast</span>
              <strong>Pickup</strong>
            </div>
          </div>
        </div>

        <section className="store-toolbar" aria-label="Shopping benefits">
          <div>
            <strong>Free shipping</strong>
            <span>on supply orders over $35</span>
          </div>
          <div>
            <strong>Easy returns</strong>
            <span>simple school-year exchanges</span>
          </div>
          <div>
            <strong>Secure checkout</strong>
            <span>cart saved while you shop</span>
          </div>
        </section>
      </section>
    </div>
  );
}

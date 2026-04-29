import { useParams, useNavigate } from 'react-router-dom';
import './CategoryPage.css';

const products = {
  pencils: [
    { id: 1, name: 'Mechanical Pencil', price: 5, image: 'mechanical_pencil.jpeg' },
    { id: 2, name: 'Color Pencil Set', price: 3, image: 'color_pensilset.jpeg' },
    { id: 3, name: 'Drawing Pencil Kit', price: 8, image: 'drawing_pencilkit.jpeg' },
  ],
  pens: [
    { id: 1, name: 'Gel Pen', price: 3, image: 'gel_pen.jpeg' },
    { id: 2, name: 'Blue Ink Pen', price: 5, image: 'blueink_pen.jpeg' },
    { id: 3, name: 'Red Ink Pen', price: 6, image: 'redink_pen.jpeg' },
  ],
  erasers: [
    { id: 1, name: 'Kneaded Eraser', price: 2, image: 'kneaded_eraser.jpeg' },
    { id: 2, name: 'Art Eraser Set', price: 4, image: 'art_eraserset.jpeg' },
    { id: 3, name: 'Mini Erasers Pack', price: 2.5, image: 'mini_eraserspack.jpeg' },
    { id: 4, name: 'Dust-Free Eraser', price: 3, image: 'dust-free_eraser.jpeg' },
  ],
  notebooks: [
    { id: 1, name: 'Spiral Notebook', price: 3, image: 'spiral_notebook.jpeg' },
    { id: 2, name: 'Composition Notebook', price: 2.5, image: 'composition_notebook.jpeg' },
    { id: 3, name: 'Hardcover Notebook', price: 6, image: 'hardcover_notebook.jpeg' },
    { id: 4, name: 'Mini Notebook', price: 2, image: 'mini_notebook.jpeg' },
    { id: 5, name: 'College Ruled Notebook', price: 3.5, image: 'college-ruled_notebook.jpeg' },
  ],
  rulers: [
    { id: 1, name: 'Plastic Ruler', price: 2, image: 'plastic_ruler.jpeg' },
    { id: 2, name: 'Metal Ruler', price: 5, image: 'metal_ruler.jpeg' },
    { id: 3, name: 'Flexible Ruler', price: 3, image: 'flexible_ruler.jpeg' },
  ],
  calculators: [
    { id: 1, name: 'Basic Calculator', price: 10, image: 'basic_calculator.jpeg' },
    { id: 2, name: 'Scientific Calculator', price: 20, image: 'scientific_calculator.jpeg' },
    { id: 3, name: 'Graphing Calculator', price: 50, image: 'graphing_calculator.jpeg' },
    { id: 4, name: 'Solar Calculator', price: 15, image: 'solar_calculator.jpeg' },
    { id: 5, name: 'Financial Calculator', price: 30, image: 'financial_calculator.jpeg' },
    { id: 6, name: 'Mini Pocket Calculator', price: 8, image: 'mini-pocket_calculator.jpeg' },
  ],
};

const emojis = {
  pencils: '✏️', pens: '🖊️', erasers: '🧽',
  notebooks: '📓', rulers: '📏', calculators: '🧮'
};

export default function CategoryPage({ onAddToCart, cart }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const items = products[category] || [];

  const getQty = (item) => {
    const found = cart.find(i => i.id === item.id && i.category === category);
    return found ? found.qty : 0;
  };

  return (
    <div className="category-page">
      <button className="back-btn" onClick={() => navigate('/store')}>← Back to Categories</button>
      <h1>{emojis[category]} {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="products-grid">
        {items.map((item) => {
          const qty = getQty(item);
          return (
            <div className="product-card" key={item.id}>
              <div className="product-img-wrap">
                <img src={`/images/${item.image}`} alt={item.name} />
              </div>
              <div className="product-info">
                <h2>{item.name}</h2>
                <p className="product-price">${item.price.toFixed(2)}</p>
                {qty === 0 ? (
                  <button className="add-btn" onClick={() => onAddToCart({ ...item, category })}>
                    Add to Cart
                  </button>
                ) : (
                  <div className="qty-controls">
                    <button onClick={() => onAddToCart({ ...item, category, qty: -1 })}>−</button>
                    <span>{qty} in cart</span>
                    <button onClick={() => onAddToCart({ ...item, category })}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
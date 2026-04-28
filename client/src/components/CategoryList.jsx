import { useState, useEffect } from 'react';
import "./CategoryList.css"
export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This replaces your 'DOMContentLoaded' event listener
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError("Unable to load categories right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // The empty array [] means this runs only once when the component mounts

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  const handleCategoryClick = (name) => {
    // This replaces your 'attachButtonListeners' logic
    window.location.href = `/sub-categories/${name.toLowerCase()}.html`;
  };

  return (
    <div id="category-container">
      {categories.map((cat) => (
        <button 
          key={cat.id} 
          onClick={() => handleCategoryClick(cat.name)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
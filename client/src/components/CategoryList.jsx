import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added Link import
import "./CategoryList.css";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("DEBUGGING ERROR:", err);
        setError("Unable to load categories right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

return (
  <div className="categories">
    {categories.length === 0 ? (
      <p>No categories found in the database.</p>
    ) : (
      categories.map((cat) => (
        <Link 
          key={cat.id} 
          to={`/sub-categories/${cat.name.toLowerCase()}`}
          className="category-button"
          id={cat.name.toLowerCase()}
        >
          {cat.name}
        </Link>
      ))
    )}
  </div>
);
}
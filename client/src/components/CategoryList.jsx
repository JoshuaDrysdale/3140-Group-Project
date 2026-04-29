import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CategoryList.css"

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  const handleCategoryClick = (name) => {
    navigate(`/category/${name.toLowerCase()}`);
  };

  return (
    <div className="categories">
      {categories.map((cat) => (
        <button
          key={cat.id}
          id={cat.name.toLowerCase()}
          onClick={() => handleCategoryClick(cat.name)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
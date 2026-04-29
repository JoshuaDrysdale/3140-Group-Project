import CategoryList from './CategoryList';
import './Store.css';

export default function Store() {
  return (
    <div className="store">
      <div className="store-banner">
        <h1>🎓 Welcome to SchoolMart</h1>
        <p>Everything you need for academic success</p>
      </div>
      <h2 className="store-section-title">Shop by Category</h2>
      <CategoryList />
    </div>
  );
}

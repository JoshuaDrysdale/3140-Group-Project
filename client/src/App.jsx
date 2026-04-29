import CategoryList from './components/CategoryList';
import SubCategory from './components/SubCategory';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Welcome to Our Store</h1>
        
        {/* The Routes component acts as the "switcher" */}
        <Routes>
          {/* This route renders the list on the home page */}
          <Route path="/" element={<CategoryList />} />
          
          {/* This route renders the SubCategory component when the URL matches /sub-categories/:id */}
          <Route path="/sub-categories/:id" element={<SubCategory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
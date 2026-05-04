require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');

// Initialize the client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  // We export the client itself so server.js can use .from()
  supabase, 
  
  // We export your helpers
  getCategories: async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  },

  getProductsByCategory: async (categoryName) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories!inner(name)')
      .ilike('categories.name', categoryName);

    if (error) throw error;
    return data;
  }
};
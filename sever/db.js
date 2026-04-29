require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  supabase,
  
  // Your existing function
  getCategories: async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  },

  // Your new function (now correctly placed inside the export object)
  getProductsByCategory: async (categoryName) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories!inner(name)')
      .ilike('categories.name', categoryName);

    if (error) throw error;
    return data;
  }
};
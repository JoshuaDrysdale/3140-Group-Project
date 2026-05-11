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

  getProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('id', { ascending: true });

    if (error) throw error;
    return data.map((product) => ({
      ...product,
      category: product.categories?.name?.trim()
    }));
  },

  getProductsByCategory: async (categoryName) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories!inner(name)')
      .ilike('categories.name', categoryName);

    if (error) throw error;
    return data.map((product) => ({
      ...product,
      category: product.categories?.name?.trim()
    }));
  },

  createUser: async (name, email, passwordHash) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash: passwordHash }])
      .select('id,name,email,created_at')
      .single();

    if (error) throw error;
    return data;
  },

  getUserByEmail: async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('id,name,email,password_hash,created_at')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  updateUser: async (id, { name, email }) => {
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, name, email, created_at')
      .single();

    if (error) throw error;
    return data;
  }
};

// This tells Node.js to ignore the invalid certificate warning
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  supabase, // Export the client just in case
  getCategories: async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  }
};
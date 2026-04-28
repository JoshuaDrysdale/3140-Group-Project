// This tells Node.js to ignore the invalid certificate warning
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
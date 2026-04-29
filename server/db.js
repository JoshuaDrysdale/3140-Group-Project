<<<<<<<< HEAD:server/db.js
========
// This tells Node.js to ignore the invalid certificate warning
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require("dotenv").config();
>>>>>>>> bc5511fe73e2c931f64983007af146cec16c989e:sever/db.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

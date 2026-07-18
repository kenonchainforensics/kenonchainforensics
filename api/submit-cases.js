import { createClient } from '@supabase/supabase-js';

// Connect to your Supabase instance using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests (form submissions)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { client_name, email, phone_number } = req.body;

    // Generate a clean, readable tracking ID (e.g., KEN-49210)
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `KEN-${randomDigits}`;

    // Insert the submission safely into your Supabase 'cases' table
    const { data, error } = await supabase
      .from('cases')
      .insert([
        { 
          tracking_id: trackingId, 
          client_name, 
          email, 
          phone_number, 
          status: 'Pending' 
        }
      ]);

    if (error) throw error;

    // Redirect the browser instantly to your custom success page
    res.writeHead(302, { Location: '/success.html' });
    res.end();

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
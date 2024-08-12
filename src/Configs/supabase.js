import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = "https://ncfyyvubwnlhjzfugonq.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZnl5dnVid25saGp6ZnVnb25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyODgxOTYsImV4cCI6MjAzODg2NDE5Nn0.BSgcfTLF-lh1vH7_u-YeaMaz_wf9O3GvtkvpEzHiyeI";

const supabase = createClient(PROJECT_URL, API_KEY);

// For regular user authentication
export const auth = supabase.auth;

export default supabase;

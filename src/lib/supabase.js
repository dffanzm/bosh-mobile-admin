import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ngjkorwojlytzugxkhih.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5namtvcndvamx5dHp1Z3hraGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTMxMjUsImV4cCI6MjA4MjE2OTEyNX0.9yPTl5J30HeLd0CDI9EMvrii8gGoQAhgTZ9wIm_E2Nk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const API_BASE_URL = "https://bosh-render.vercel.app/api";

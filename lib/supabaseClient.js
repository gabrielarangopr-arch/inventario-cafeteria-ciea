import { createClient } from '@supabase/supabase-js'

// Saca estos datos de Project Settings > API en tu panel de Supabase
const supabaseUrl = 'sb_publishable_PRhXmuGCIFrAKQdTkP8KWg_wH1gwaxs'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjam5pa3NuaXhqem9vd2ZvZmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Mjg1NzYsImV4cCI6MjEwMTAwNDU3Nn0.Guf1ggurVrZ1XzAmLjR5USZwB4ZGLb1_Ooq0l0NzQI0'

export const supabase = createClient(supabaseUrl, supabaseKey)
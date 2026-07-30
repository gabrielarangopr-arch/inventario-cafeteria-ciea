import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://inventario-cafeteria-ciea.supabase.co' 
const supabaseKey = 'sb_publishable_PRhXmuGCIFrAKQdTkP8KWg_wH1gwaxs' 

export const supabase = createClient(supabaseUrl, supabaseKey)
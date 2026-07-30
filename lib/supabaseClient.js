import { createClient } from '@supabase/supabase-js'

// Pega tu URL y tu Key directamente aquí entre las comillas simples
const supabaseUrl = 'https://inventario-cafeteria-ciea.supabase.co' 
const supabaseKey = 'sb_publishable_PRhXmuGCIFrAKQdTkP8KWg_wH1gwaxsgit add lib/supabaseClient.js' 

export const supabase = createClient(supabaseUrl, supabaseKey)
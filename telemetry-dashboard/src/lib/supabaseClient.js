import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://czovafovllliqhxckilc.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ojIn_OVa4TeupcbwXNLwgQ_R0Q_8dFs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

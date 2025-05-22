import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (em um ambiente real, essas credenciais estariam em variáveis de ambiente)
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'your-supabase-key';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Arquivo temporário para supabase
// Para usar o Supabase, instale a dependência: npm install @supabase/supabase-js

// Importação comentada para evitar erros de build
// import { createClient } from '@supabase/supabase-js';

// Cliente temporário para evitar erros de build
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (field: string, value: any) => Promise.resolve({ data: [], error: null }),
      order: (column: string, options: any = {}) => ({
        limit: (limit: number) => Promise.resolve({ data: [], error: null })
      })
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (field: string, value: any) => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: (field: string, value: any) => Promise.resolve({ data: null, error: null })
    })
  }),
  auth: {
    signIn: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null })
  }
};

import { createClient } from '@supabase/supabase-js'

// Use environment variables - these will be set in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
})

// Todo functions
export const saveTodo = async (todo: any) => {
  const { data, error } = await supabase
    .from('kv_store_a218721a')
    .upsert({
      key: `todo_${todo.id}`,
      value: todo
    })
  
  if (error) {
    console.error('Error saving todo:', error)
    throw error
  }
  
  return data
}

export const getTodos = async () => {
  const { data, error } = await supabase
    .from('kv_store_a218721a')
    .select('*')
    .like('key', 'todo_%')
  
  if (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
  
  return data?.map(item => item.value) || []
}

export const deleteTodo = async (todoId: string) => {
  const { error } = await supabase
    .from('kv_store_a218721a')
    .delete()
    .eq('key', `todo_${todoId}`)
  
  if (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}

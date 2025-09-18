import { useState } from 'react';

export function SupabaseTest() {
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    try {
      setResult('Testing connection through working API server...');
      
      // Test 1: Basic API connectivity
             const testResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/test`);
      
      if (!testResponse.ok) {
        setResult(`❌ API server not responding: ${testResponse.status}`);
        return;
      }
      
      const testData = await testResponse.json();
      setResult(`✅ API server working: ${testData.message}`);

      // Test 2: Get todos from Supabase
      setResult(prev => prev + '\n\nTesting Supabase connection...');
             const todosResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/todos`);
      
      if (!todosResponse.ok) {
        setResult(prev => prev + `\n❌ Failed to get todos: ${todosResponse.status}`);
        return;
      }
      
      const todosData = await todosResponse.json();
      setResult(prev => prev + `\n✅ Successfully connected to Supabase! Found ${todosData.length} todos.`);

      // Test 3: Save a new todo
      setResult(prev => prev + '\n\nTesting data insertion...');
      const newTodo = {
        id: `test_${Date.now()}`,
        title: 'Test Todo from React App',
        description: 'This is a test todo saved from React',
        priority: 'high',
        completed: false
      };
      
             const saveResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });

      if (saveResponse.ok) {
        setResult(prev => prev + '\n✅ Successfully saved new todo to Supabase!');
      } else {
        setResult(prev => prev + `\n❌ Insert failed: ${saveResponse.status}`);
      }

    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Supabase Connection Test</h2>
      <button onClick={testConnection} style={{ padding: '10px', marginBottom: '10px' }}>
        Test Supabase Connection
      </button>
      <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
        {result}
      </div>
    </div>
  );
}

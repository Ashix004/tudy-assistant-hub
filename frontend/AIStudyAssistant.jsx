import { useState } from 'react';

export default function AIStudyAssistant() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('explain');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, input }),
      });
      const data = await res.json();
      setOutput(data.output || data.error);
    } catch (err) {
      setOutput('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>AI Study Assistant</h1>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="explain">Explain Topic</option>
        <option value="notes">Clean Notes</option>
        <option value="polish">Polish Answer</option>
      </select>
      <textarea
        rows="8"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your content here..."
      ></textarea>
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      <pre>{output}</pre>
    </div>
  );
}

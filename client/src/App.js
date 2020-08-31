import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [number, setNumber] = useState();
  const [error, setError] = useState('');
  const [numbers, setNumbers] = useState([]);

  const sendNumber = async () => {
    try {
      const res = await axios.post('/api/values', { number });
      setNumber('');
    } catch (e) {
      console.log(e)
    }
  }

  const fetchNumbers = async () => {
    const res = await axios.get('/api/values');
    setNumbers(res.data);
  }

  useEffect(() => { fetchNumbers() }, [sendNumber]);

  return (
    <div className="App">
      {error && <p>{error}</p>}
      <p>Numbers: {numbers.map(n => n.number + ', ')}</p>
      <input type="text" onChange={(e) => setNumber(e.target.value)} />
      <button onClick={sendNumber}>Send</button>
    </div>
  );
}

export default App;

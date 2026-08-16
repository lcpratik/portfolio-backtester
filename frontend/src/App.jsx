import { useState } from 'react'

function App() {
  const [startingAmount, setStartingAmount] = useState(0);

  return (
    <div>
      <p>Starting amount: {startingAmount}</p>
      <input
        type="number"
        value={startingAmount}
        onChange={(e) => setStartingAmount(e.target.value)}
      />
    </div>
  )
}

export default App
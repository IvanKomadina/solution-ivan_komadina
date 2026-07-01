import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-4">Product list coming soon</div>} />
      <Route path="/products/:id" element={<div className="p-4">Product detail coming soon</div>} />
    </Routes>
  )
}

export default App
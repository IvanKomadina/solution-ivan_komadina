import { Routes, Route } from 'react-router-dom'
import { ProductListPage } from './pages/ProductListPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductListPage />} />
      <Route path="/products/:id" element={<div className="p-4">Product detail coming soon</div>} />
    </Routes>
  )
}

export default App
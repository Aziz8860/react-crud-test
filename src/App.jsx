import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SalesList from './pages/SalesList'
import SalesForm from './pages/SalesForm'
import SalesDetail from './pages/SalesDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Sales Management App</h1>
          </div>
        </header>
        
        <main className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<SalesList />} />
            <Route path="/add" element={<SalesForm />} />
            <Route path="/edit/:id" element={<SalesForm />} />
            <Route path="/detail/:id" element={<SalesDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-200 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            <p>&copy; 2025 Sales Management App</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

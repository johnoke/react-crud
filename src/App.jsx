import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom'
import './App.css'
import ProductsList from './List'
import CreateProduct from './Create'
import EditProduct from './Edit'
<Routes>
<Route path='products' element={<ProductsList />}/>
<Route path='products/create' element={<CreateProduct />}/>
</Routes>

function App() {
  return (
    <BrowserRouter>
      <h2>Products</h2>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsList />}/>
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App

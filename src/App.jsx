import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom'
import './App.css'
import ProductsList from './List'
import CreateProduct from './Create'
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
      </Routes>
    </BrowserRouter>
    // <>
    //   <section id="center">
    //     <h1>Products</h1>
    //     <a href=''>Create new product</a>
    //     {/* <div className="hero">
    //       <img src={heroImg} className="base" width="170" height="179" alt="" />
    //       <img src={reactLogo} className="framework" alt="React logo" />
    //       <img src={viteLogo} className="vite" alt="Vite logo" />
    //     </div> */}
    //     <div>
    //     <ProductsList products={products} />
    //     </div>
    //     {/* <button
    //       type="button"
    //       className="counter"
    //       onClick={() => setCount((count) => count + 1)}
    //     >
    //       Count is {count}
    //     </button> */}
    //   </section>
    // </>
  )
}
export default App

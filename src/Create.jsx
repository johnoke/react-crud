import { Link } from "react-router-dom";
import { useState } from "react";
function CreateProduct(){
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    function validateField(field, value) {
        let message = null;
        if (!value.trim()) {
        message = `${field} is required`;
        }
        return message; 
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const newErrors = { name: validateField("Product name", name), price: validateField("Price", price), stock: validateField("Stock", stock)};
        
        setErrors(newErrors)
    }
    function handleNameChange(e) {
        const value = e.target.value;
        setName(e.target.value);
        // clear error immediately when user types
       
        setErrors(prev => ({ ...prev, name: validateField("Product name", value) }));
    
    }

    function handlePriceChange(e) {
        const value = e.target.value;
        setPrice(e.target.value);
       
        setErrors(prev => ({ ...prev, price: validateField("Price", value) }));
        
    }
    
    function handleStockChange(e) {
        const value = e.target.value;
        setStock(e.target.value);
       
        setErrors(prev => ({ ...prev, stock: validateField("Stock", value) }));
        
    }
    return (
    <>
      <div>
        <Link to="/products">Back</Link>
        <h2>Create Product</h2>
        <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input className="form-control" value={name} onChange={handleNameChange} />
          {errors.name && <span className="error-label">{errors.name}</span>}
        </div>
        <div>
          <label>Price:</label>
          <input className="form-control" type="number" value={price} onChange={handlePriceChange} />
          {errors.price && <span className="error-label">{errors.price}</span>}
        </div>
        <div>
          <label>Stock:</label>
          <input className="form-control" type="number" value={stock} onChange={handleStockChange} />
          {errors.stock && <span className="error-label">{errors.stock}</span>}
        </div>
        <button className="btn" type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </>
  )
}
export default CreateProduct;
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function CreateProduct(){
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
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
        if (!newErrors.name && !newErrors.price && !newErrors.stock) {
            try {
                const product = { name, price, stock };
                await postProduct(product);   // <-- actually send to API
                setMessage("Product created successfully!");
                // navigate happens inside postProduct after success
            } catch (err) {
                setMessage(err.message);
            }
        }
    }
    async function refreshToken() {
      const response = await fetch("https://localhost:7110/api/security/token");
      const data = await response.json();
      return data.access_token;
    }
    async function postProduct(product) {
        const token = localStorage.getItem("accessToken");

        // First attempt with current token
        let response = await fetch("https://localhost:7110/api/products", {
            method: "POST",
            headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });

        // If token expired, refresh and retry
        if (response.status === 401) {
            const newToken = await refreshToken();
            localStorage.setItem("accessToken", newToken);

            // Retry product POST with new token
            response = await fetch("https://localhost:7110/api/products", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${newToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
            });
            if (!response.ok) {
                throw new Error("Failed to create product");
            } else {
                navigate("/products");}
        }
        if (!response.ok) {
            throw new Error("Failed to create product");
        } else {
            navigate("/products");} 
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
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();          // get product id from route
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
    useEffect(() => {
    // if no id in URL, redirect back
    if (!id) {
      navigate("/products");
      return;
    }
    
    // fetch product details
    async function fetchProduct() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`https://localhost:7110/api/products/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 401) {
          // refresh token if needed
          const refreshResponse = await fetch("https://localhost:7110/api/security/token");
          const data = await refreshResponse.json();
          localStorage.setItem("accessToken", data.access_token);

          // retry fetch
          const retry = await fetch(`https://localhost:7110/api/products/${id}`, {
            headers: { "Authorization": `Bearer ${data.access_token}` }
          });
          if (!retry.ok) throw new Error("Failed to load product");
          setProduct(await retry.json());
        } else if (!response.ok) {
          throw new Error("Failed to load product");
        } else {
          setProduct(await response.json());
        }
      } catch (err) {
        setMessage(err.message);
        navigate("/products"); // fallback redirect
      }
    }

    fetchProduct();
  }, [id, navigate]);
    function validateField(field, value) {
        let message = null;
        if (!value.trim()) {
        message = `${field} is required`;
        }
        return message; 
    }
    async function handleSubmit(e) {
        e.preventDefault();
         const newErrors = {
            name: validateField("Product name", product.name),
            price: validateField("Price", product.price?.toString() ?? ""),
            stock: validateField("Stock", product.stock?.toString() ?? "")
        };
        setErrors(newErrors)
        if (!newErrors.name && !newErrors.price && !newErrors.stock) {
            try {
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
        let response = await fetch("https://localhost:7110/api/products/" + product.id, {
            method: "PUT",
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
        setProduct(prev => ({ ...prev, name: value }));
        setErrors(prev => ({ ...prev, name: validateField("Product name", value) }));
    
    }

    function handlePriceChange(e) {
        const value = e.target.value;
        setProduct(prev => ({ ...prev, price: value }));
        setErrors(prev => ({ ...prev, price: validateField("Price", value) }));
        
    }
    
    function handleStockChange(e) {
        const value = e.target.value;
        setProduct(prev => ({ ...prev, stock: value }));
        setErrors(prev => ({ ...prev, stock: validateField("Stock", value) }));
        
    }
  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/products">Back</Link>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input className="form-control" value={product.name} onChange={handleNameChange}  />
          {errors.name && <span className="error-label">{errors.name}</span>}
        </div>
        <div>
          <label>Price:</label>
          <input className="form-control" type="number" value={product.price} onChange={handlePriceChange}  />
          {errors.price && <span className="error-label">{errors.price}</span>}
        </div>
        <div>
          <label>Stock:</label>
          <input className="form-control" type="number" value={product.stock} onChange={handleStockChange}  />
          {errors.stock && <span className="error-label">{errors.stock}</span>}
        </div>
        <button className="btn" type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditProduct;

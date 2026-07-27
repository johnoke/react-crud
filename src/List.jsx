import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
function ProductsList(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    async function fetchProducts(){
      const token = localStorage.getItem("accessToken");
      try{
        const response = await fetch("https://localhost:7110/api/products", 
          { headers: { "Authorization": 'Bearer ' + token, "Content-Type": "application/json"} });
        if(response.status === 401){
          const newToken = await refreshToken();
          localStorage.setItem("accessToken", newToken);
          return fetchProducts();
        }
        const data = await response.json();
        setProducts(data);
      } catch(error){
        console.error("Error fetching products", error);
      } finally{
        setLoading(false);
      }
    }
    async function refreshToken() {
      const response = await fetch("https://localhost:7110/api/security/token");
      const data = await response.json();
      return data.access_token;
    }
    async function deleteProduct(id) {
        const token = localStorage.getItem("accessToken");

        try {
            // First attempt
            let response = await fetch(`https://localhost:7110/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            });

            // If unauthorized, refresh and retry
            if (response.status === 401) {
            const newToken = await refreshToken();
            localStorage.setItem("accessToken", newToken);

            response = await fetch(`https://localhost:7110/api/products/${id}`, {
                method: "DELETE",
                headers: {
                "Authorization": `Bearer ${newToken}`,
                "Content-Type": "application/json"
                }
            });
            }

            if (!response.ok) {
            throw new Error("Failed to delete product");
            }

            fetchProducts();
        } catch (error) {
            console.error("Error deleting product", error);
        }
   }
   useEffect(() => {
    fetchProducts();
    }, []);
    if(loading){
      return <p>Loading products ...</p>;
    }else{
      return (
      <>
      <Link to="/products/create">Create Product</Link>
      <ul>
        {products.map(product => (
          <li key={product.id}><h3>{product.name} </h3>
            <p>
              {product.price.toLocaleString()}&nbsp;
              <Link to={`/products/edit/${product.id}`}>Edit</Link>&nbsp;
              <a 
                href="#" 
                onClick={(e) => {
                    e.preventDefault(); // prevent page reload
                    deleteProduct(product.id);
                }}
                >
                Delete
                </a>
            </p>
          </li>
        ))}
      </ul>
      </>
    ); 
    }
} 
export default ProductsList;
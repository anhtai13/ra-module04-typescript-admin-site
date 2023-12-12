import { useNavigate } from "react-router-dom";
import productApi from "../../apis/product/product.api";
import ProductForm from "../../components/form/product/productForm";

function ProductCreate() {
  const navigate = useNavigate();

  const handleAdd = (product: any) => {
    productApi
      .createProduct(product)
      .then((response) => {
        navigate("/products");
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(
            error.response ? error.response.statusText : "An error occurred"
          );
        }
      });
  };

  return (
    <>
      <h1>Thêm mới sản phẩm</h1>
      <ProductForm
        productId=""
        onSubmit={handleAdd}
        onCancel={() => navigate("/products")}
      />
    </>
  );
}

export default ProductCreate;

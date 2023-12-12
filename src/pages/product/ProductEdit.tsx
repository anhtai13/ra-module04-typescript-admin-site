import { useNavigate, useParams } from "react-router-dom";
import productApi from "../../apis/product/product.api";
import ProductForm from "../../components/form/product/productForm";

interface ProductEditParams extends Record<string, string> {
  id: string;
}

function ProductEdit() {
  const navigate = useNavigate();

  const { id } = useParams<ProductEditParams>();

  const handleUpdate = (product: any) => {
    id &&
      productApi
        .updateProduct(id, product)
        .then(() => {
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
      <h1>Chỉnh sửa thông tin sản phẩm</h1>
      <ProductForm
        productId={id ?? ""}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/products")}
      />
    </>
  );
}

export default ProductEdit;

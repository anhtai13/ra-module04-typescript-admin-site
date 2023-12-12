import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import productApi from "../../../apis/product/product.api";
import ResourceNotFound from "../../errors/ResourceNotFound";

interface ProductFormProps {
  productId: string | undefined;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}
interface Product {
  sku: string;
  name: string;
  category: number | string;
  description: string;
  unitPrice: number;
  image?: File | null;
}

function productForm({ productId, onSubmit, onCancel }: ProductFormProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [product, setProduct] = useState<Product>({
    sku: "",
    name: "",
    category: 0,
    description: "",
    unitPrice: 0,
    image: null,
  });
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setIsEdit(productId !== undefined);

    if (productId === undefined) {
      setProduct({
        name: "",
        sku: "",
        category: 0,
        description: "",
        unitPrice: 0,
        image: null,
      });
    } else {
      productApi
        .getProductByProductId(productId)
        .then((response: Product) => {
          setProduct({
            ...response,
            sku: response.sku || "",
            name: response.name || "",
            image: null,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [productId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case "image":
        setProduct({
          ...product,
          [name]: event.target.files ? event.target.files[0] : null,
        });
        break;
      default:
        setProduct({
          ...product,
          [name]: name == "category" ? parseInt(value) : value,
        });
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors(new Map());

    const errors = validate();
    if (errors.size == 0) {
      const formData = new FormData();

      formData.append("name", product!.name);
      formData.append("sku", product!.sku);
      formData.append("description", product!.description);
      formData.append("unit_price", product!.unitPrice.toString());
      formData.append("category", product!.category.toString());

      if (product.image) {
        formData.append("image", product.image);
      }

      onSubmit(formData);
    } else {
      setErrors(errors);
    }
  };

  const validate = () => {
    const validationErrors = new Map<string, string>();

    if (
      product.name.length < 4 ||
      product.name.length > 69 ||
      /^[A-Za-z0-9]$/.test(product.name)
    ) {
      validationErrors.set(
        "name",
        "Tên sản phẩm bắt buộc nhập từ 4 đến 69 ký tự."
      );
    }

    if (product.description != null && product.description.length >= 100) {
      validationErrors.set(
        "description",
        "Mô tả chỉ được phép nhập nhỏ hơn 100 ký tự."
      );
    }

    if (!product.sku) {
      validationErrors.set("sku", "Mã sản phẩm không được để trống");
    }

    if (isNaN(product.unitPrice)) {
      validationErrors.set("unitPrice", "Đơn vị tiền chỉ được phép nhập số.");
    }

    return validationErrors;
  };

  return (
    <>
      {product ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Tên Sản Phẩm <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              isInvalid={!!errors.get("name")}
            />
            <Form.Text className="text-danger">{errors.get("name")}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Mã sản phẩm <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              isInvalid={!!errors.get("sku")}
            />
            <Form.Text className="text-danger">{errors.get("sku")}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả sản phẩm</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={product.description}
              onChange={handleChange}
              isInvalid={!!errors.get("description")}
            />
            <Form.Text className="text-danger">
              {errors.get("description")}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số tiền</Form.Label>
            <Form.Control
              type="number"
              name="unitPrice"
              value={product.unitPrice}
              onChange={handleChange}
              isInvalid={!!errors.get("unitPrice")}
            />
            <Form.Text className="text-danger">
              {errors.get("unitPrice")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="mr-5">
              Loại hàng <span className="text-danger">*</span>
            </Form.Label>
            <div className="px-3">
              <Form.Check
                inline
                type="radio"
                name="category"
                label="Áo phong"
                id="category-1"
                value={2}
                checked={product.category == 2}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="category"
                label="Áo sơ mi"
                id="category-2"
                value={1}
                checked={product.category == 1}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="category"
                label="Quần"
                id="category-3"
                value={3}
                checked={product.category == 3}
                onChange={handleChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh mô tả sản phẩm</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleChange}
              multiple
            />
            <Form.Text className="text-danger">{errors.get("image")}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3 float-end">
            <Button
              type="button"
              variant="secondary"
              className="m-1"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button type="submit" variant="success" className="m-1">
              Lưu
            </Button>
          </Form.Group>
        </Form>
      ) : (
        <ResourceNotFound resourceName="người dùng" />
      )}
    </>
  );
}

export default productForm;

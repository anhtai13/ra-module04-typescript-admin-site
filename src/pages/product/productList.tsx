import React, { useEffect, useState } from "react";
import { Table, Button, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import PaginationComponent from "../../components/table/PaginationComponent";
import productApi from "../../apis/product/product.api";

interface Product {
  id: number;
  name: string;
  description: string;
  category: number;
  unitPrice: number;
  created_at: string;
  updated_at: string;
}

function formatcategory(category: number) {
  if (category == 1) {
    return <Badge bg="warning">Áo sơ mi</Badge>;
  } else if (category == 2) {
    return <Badge bg="success">Áo phông</Badge>;
  } else if (category == 3) {
    return <Badge>Quần</Badge>;
  }
}

function productList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [keyword, setKeyword] = useState<string | undefined>("");
  const [page, setPage] = useState(1);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const fetchProducts = () => {
    productApi
      .searchProducts({
        keyword: keyword,
        page: page,
        limit: 5,
      })
      .then((data: any) => {
        console.log(data);
        setProducts(data[0]);
        setTotal(data[1]);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response.statusText);
        }
      });

    setSelectedProductIds([]);
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, page]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setKeyword(searchInputValue);
  };

  const handleAdd = () => {
    navigate("/products/new");
  };

  const handleEdit = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const handleBulkDelete = () => {
    const names = products
      .filter((product) => selectedProductIds.includes(product.id))
      .map((product) => product.name);

    if (
      window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm [${names}] không ?`)
    ) {
      // TODO
      fetchProducts();
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${name} không ?`)) {
      productApi
        .deleteProduct(id)
        .then(() => {
          fetchProducts();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(error.response.statusText);
          }
        });
    }
  };

  const changeProductIdCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectedProductIds([
        ...selectedProductIds,
        parseInt(event.target.value),
      ]);
    } else {
      const newSelectedProductIds = selectedProductIds.filter(
        (selectedProductId) =>
          selectedProductId !== parseInt(event.target.value)
      );
      setSelectedProductIds(newSelectedProductIds);
    }
  };

  const selectAllProductIdCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const productIds = products.map((product) => product.id);
      setSelectedProductIds(productIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  const isSelectedAllProductId =
    selectedProductIds.length !== 0 &&
    selectedProductIds.length === products.length;

  return (
    <>
      <h1>Danh sách sản phẩm</h1>
      <Form className="row m-1 mb-3" onSubmit={handleSearch}>
        <div className="col-8">
          <Form.Control
            type="text"
            value={searchInputValue}
            onChange={(event) => setSearchInputValue(event.target.value)}
            placeholder="Nhập từ khóa"
          />
        </div>
        <div className="col-4">
          <Button type="submit" variant="info mx-1">
            Tìm kiếm
          </Button>
          <Button type="button" variant="primary mx-1" onClick={handleAdd}>
            Thêm mới
          </Button>
          {selectedProductIds.length !== 0 && (
            <Button
              type="button"
              variant="danger mx-1"
              onClick={handleBulkDelete}
            >
              Xóa
            </Button>
          )}
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={selectAllProductIdCheckboxes}
                checked={isSelectedAllProductId}
              />
            </th>
            <th>Tên sản phẩm</th>
            <th>Mô tả sản phẩm</th>
            <th>Loại hàng</th>
            <th>Giá tiền</th>
            <th>Thời gian tạo</th>
            <th>Thời gian cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.length > 0 &&
            products.map((product, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      name="id"
                      id={"id-" + product.id}
                      value={product.id}
                      onChange={changeProductIdCheckbox}
                      checked={selectedProductIds.includes(product.id)}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{formatcategory(product.category)}</td>
                  <td>{Number(product.unitPrice).toLocaleString()}đ</td>
                  <td>
                    {moment(product.created_at).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td>
                    {moment(product.updated_at).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      className="m-1"
                      onClick={() => handleEdit(product.id)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      className="m-1"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <PaginationComponent total={total} setPage={setPage} />
    </>
  );
}

export default productList;

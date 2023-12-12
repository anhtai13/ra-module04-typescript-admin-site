import { Table, Button, Form, Badge } from "react-bootstrap";
import moment from "moment";
import PaginationComponent from "../../components/table/PaginationComponent";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import orderApi from "../../apis/order/order.api";

type Order = {
  image: string;
  unitPrice: any;
  id: number;
  serialNumber: string;
  userId: number;
  username: string;
  status: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  quantity: number;
  sku: string;
  user: any;
};

const formatStatus = (status: number): JSX.Element => {
  if (status == 1) {
    return <Badge bg="warning">Đơn hàng mới</Badge>;
  } else if (status == 2) {
    return <Badge>Đã xác thực</Badge>;
  } else if (status == 3) {
    return <Badge bg="success">Đang giao hàng</Badge>;
  } else if (status == 4) {
    return <Badge bg="info">Đã giao hàng</Badge>;
  } else if (status == 5) {
    return <Badge bg="dark">Đã thanh toán</Badge>;
  } else if (status == 6) {
    return <Badge bg="secondary">Hoàn tất</Badge>;
  } else if (status == 7) {
    return <Badge bg="danger">Bị từ chối</Badge>;
  }
  return <></>;
};

function OrderList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [listOrders, setListOrders] = useState<any[]>([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  const [keyword, setKeyword] = useState<string | undefined>("");
  const [page, setPage] = useState(1);

  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");

  const fetchOrders = () => {
    orderApi
      .searchOrders({
        keyword: keyword,
        page: page,
        limit: 5,
      })
      .then((data: any) => {
        setOrders(data[0]);
        setTotal(data[1]);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(
            error.response ? error.response.statusText : "An error occurred"
          );
        }
      });

    setSelectedOrderIds([]);
  };

  useEffect(() => {
    fetchOrders();
  }, [keyword, page]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setKeyword(searchInputValue);
  };

  const handleEdit = (id: number) => {
    navigate(`/orders/${id}/edit`);
  };

  const handleShowDetail = (id: number) => {
    orderApi
      .getOrderDetailByOrderDetailId(id)
      .then((data) => {
        setImage(data.orderImage);
        setListOrders(data.orderResult);
        setUsername(data.orderUsername);
      })
      .catch((error) => {
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

  const handleBulkDelete = () => {
    const name = orders
      .filter(
        (order) =>
          !!selectedOrderIds.find(
            (selectedOrderIds) => selectedOrderIds === order.id
          )
      )
      .map((order) => order.serialNumber);

    if (
      window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng [${name}] không ?`)
    ) {
      // TODO
      fetchOrders();
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${name} không ?`)) {
      orderApi
        .deleteOrder(id)
        .then(() => {
          fetchOrders();
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/admin/login");
          } else {
            alert(
              error.response ? error.response.statusText : "An error occurred"
            );
          }
        });
    }
  };

  const changeOrderIdCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectedOrderIds([
        ...selectedOrderIds,
        parseInt(event.target.value, 10),
      ]);
    } else {
      const newSelectedOrderIds = selectedOrderIds.filter(
        (selectedOrderId) =>
          selectedOrderId !== parseInt(event.target.value, 10)
      );
      setSelectedOrderIds(newSelectedOrderIds);
    }
  };

  const selectAllOrderIdCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const orderIds = orders.map((order) => order.id);
      setSelectedOrderIds(orderIds);
    } else {
      setSelectedOrderIds([]);
    }
  };

  const isSelectedAllOrderId =
    selectedOrderIds.length !== 0 && selectedOrderIds.length === orders.length;
  return (
    <>
      <h1>Danh sách đơn hàng</h1>
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
          {selectedOrderIds.length !== 0 && (
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
                onChange={selectAllOrderIdCheckboxes}
                checked={isSelectedAllOrderId}
              />
            </th>
            <th>Mã đơn hàng</th>
            <th>ID Người dùng</th>
            <th>Tên người dùng</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Thời gian tạo</th>
            <th>Thời gian cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.length > 0 &&
            orders.map((order, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      name="id"
                      id={`id -${order.id}`}
                      value={order.id}
                      onChange={changeOrderIdCheckbox}
                      checked={selectedOrderIds.includes(order.id)}
                    />
                  </td>
                  <td>{order.serialNumber}</td>
                  <td>{order.userId}</td>
                  <td>{order.user.username}</td>
                  <td>{formatStatus(order.status)}</td>
                  <td>{Number(order.totalPrice).toLocaleString()}đ</td>
                  <td>{moment(order.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{moment(order.updatedAt).format("YYYY-MM-DD HH:mm")}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="m-1"
                      onClick={() => handleEdit(order.id)}
                    >
                      Cập nhật
                    </Button>

                    <Button
                      variant="success"
                      className="m-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => handleShowDetail(order.id)}
                    >
                      Chi tiết
                    </Button>

                    {/* <Button
                      variant="danger"
                      className="m-1"
                      onClick={() => handleDelete(order.id, order.serialNumber)}
                    >
                      Hủy
                    </Button> */}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Chi tiết đơn hàng
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {listOrders.map((item, itemIndex) => {
                return (
                  <div key={itemIndex}>
                    <div className="mb-5">
                      Tên sản phẩm: <b>{item.name}</b> <br />
                      Mã sản phẩm: <b>{item.sku}</b>
                      <br />
                      Số lượng sản phẩm: <b>{item.quantity}</b> <br />
                      Giá tiền mỗi sản phẩm:{" "}
                      <b>{Number(item.unitPrice).toLocaleString()} đ</b> <br />
                      Tổng tiền sản phẩm:{" "}
                      <b>{Number(item.subTotalPrice).toLocaleString()} đ</b>
                      <br />
                      Ảnh sản phẩm <br />
                      <div className="text-center">
                        <img
                          src={image}
                          height={200}
                          width={200}
                          alt="Product"
                        />
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaginationComponent total={total} setPage={setPage} />
    </>
  );
}

export default OrderList;

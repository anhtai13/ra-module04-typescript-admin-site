import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";
import orderApi from "../../../apis/order/order.api";
import ResourceNotFound from "../../errors/ResourceNotFound";

interface OrderFormProps {
  orderId?: string;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

interface Order {
  serialNumber: string;
  userId: string;
  // username: string;
  status: number;
  totalPrice: number;
  orderAt: string;
  image?: File | null;
}

function OrderForm({ orderId, onSubmit, onCancel }: OrderFormProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [order, setOrder] = useState<Order>({
    serialNumber: "",
    userId: "",
    // username: "",
    status: 0,
    totalPrice: 0,
    orderAt: "",
    image: null,
  });
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setIsEdit(!!orderId);

    if (!orderId) {
      setOrder({
        serialNumber: "",
        userId: "",
        // username: "",
        status: 0,
        totalPrice: 0,
        orderAt: "",
        image: null,
      });
    } else {
      orderApi
        .getOrderByOrderId(orderId)
        .then((response) => {
          setOrder({
            ...response,
            serialNumber: response.serialNumber || "",
            userId: response.userId || "",
            status: response.status || 0,
            orderAt: response.orderAt || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [orderId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case "image":
        if (event.target.files) {
          setOrder({
            ...order,
            [name]: event.target.files[0],
          });
        }
        break;
      case "totalPrice":
        setOrder({
          ...order,
          [name]: parseFloat(value) || 0,
        });
        break;
      default:
        setOrder({
          ...order,
          [name]: name === "status" ? parseInt(value) : value,
        });
        break;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(new Map());

    const validationErrors = validate();
    if (validationErrors.size == 0) {
      const formData = new FormData();

      formData.append("serialNumber", order.serialNumber);
      formData.append("userId", order.userId);
      // formData.append("username", order.username);
      formData.append("status", order.status.toString());
      formData.append("totalPrice", order.totalPrice.toString());
      formData.append("orderAt", order.orderAt);

      if (order.image) {
        formData.append("image", order.image);
      }

      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = () => {
    const validationErrors = new Map<string, string>();

    // if (
    //   order.serialNumber.length < 4 ||
    //   order.serialNumber.length > 69 ||
    //   !/^[A-Za-z0-9]+$/.test(order.serialNumber)
    // ) {
    //   validationErrors.set(
    //     "serialNumber",
    //     "Tên sản phẩm bắt buộc nhập từ 4 đến 69 ký tự."
    //   );
    // }

    // if (!order.serialNumber) {
    //   validationErrors.set("serialNumber", "Mã sản phẩm không được để trống");
    // }

    // if (isNaN(parseFloat(order.totalPrice))) {
    //   validationErrors.set("totalPrice", "Đơn vị tiền chỉ được phép nhập số.");
    // }

    return validationErrors;
  };

  return (
    <>
      {order ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Mã đơn hàng <span className="text-danger"></span>
            </Form.Label>
            <Form.Control
              type="text"
              name="serialNumber"
              value={order.serialNumber}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("serialNumber")}
            />
            <Form.Text className="text-danger">
              {errors.get("serialNumber")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              ID người dùng <span className="text-danger"></span>
            </Form.Label>
            <Form.Control
              type="text"
              name="userId"
              value={order.userId}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("userId")}
            />
            <Form.Text className="text-danger">
              {errors.get("userId")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tổng tiền</Form.Label>
            <Form.Control
              type="number"
              disabled={isEdit}
              name="totalPrice"
              value={order.totalPrice}
              onChange={handleChange}
              isInvalid={!!errors.get("totalPrice")}
            />
            <Form.Text className="text-danger">
              {errors.get("totalPrice")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Thời gian tạo <span className="text-danger"></span>
            </Form.Label>
            <Form.Control
              type="text"
              name="orderAt"
              value={order.orderAt}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("orderAt")}
            />
            <Form.Text className="text-danger">
              {errors.get("orderAt")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="mr-5">
              Trạng thái đơn hàng <span className="text-danger">*</span>
            </Form.Label>
            <div className="px-3">
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Đơn hàng mới"
                id="status-1"
                value={1}
                checked={order.status == 1}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Đã xác thực"
                id="role-2"
                value={2}
                checked={order.status == 2}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Đang giao hàng"
                id="role-3"
                value={3}
                checked={order.status == 3}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Đã giao hàng"
                id="role-4"
                value={4}
                checked={order.status == 4}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Đã thanh toán"
                id="role-5"
                value={5}
                checked={order.status == 5}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Hoàn tất"
                id="role-6"
                value={6}
                checked={order.status == 6}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Bị từ chối"
                id="role-7"
                value={7}
                checked={order.status == 7}
                onChange={handleChange}
              />
            </div>
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

export default OrderForm;

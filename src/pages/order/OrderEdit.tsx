import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import React from "react";
import orderApi from "../../apis/order/order.api";
import OrderForm from "../../components/form/order/orderForm";

interface OrderEditParams extends Record<string, string> {
  id: string;
}

function OrderEdit() {
  const navigate = useNavigate();
  const { id } = useParams<OrderEditParams>();

  const handleUpdate = (order: any) => {
    id &&
      orderApi
        .updateOrder(id, order)
        .then(() => {
          navigate("/orders");
        })
        .catch((error: any) => {
          if (error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(error.response.statusText);
          }
        });
  };

  return (
    <>
      <h1>Cập nhật đơn hàng</h1>
      <OrderForm
        orderId={id}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/orders")}
      />
    </>
  );
}

export default OrderEdit;

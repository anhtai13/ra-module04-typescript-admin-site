import { createBrowserRouter, RouteObject } from "react-router-dom";
import { Router } from "@remix-run/router";

import DefaultLayout from "../layouts/DefaultLayout";

import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import UserList from "../pages/user/UserList";
import UserEdit from "../pages/user/UserEdit";
import productList from "../pages/product/productList";
import UserCreate from "../pages/user/UserCreate";
import ProductCreate from "../pages/product/ProductCreate";
import ProductEdit from "../pages/product/ProductEdit";
import OrderEdit from "../pages/order/OrderEdit";
import OrderList from "../pages/order/OrderList";

const routes: RouteObject[] = [
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    id: "root",
    path: "/",

    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        Component: UserList,
        path: "/users",
      },
      {
        Component: UserCreate,
        path: "users/new",
      },
      {
        Component: UserEdit,
        path: "/users/:id/edit",
      },
      {
        Component: productList,
        path: "/products",
      },
      {
        Component: ProductCreate,
        path: "/products/new",
      },
      {
        Component: ProductEdit,
        path: "/products/:id/edit",
      },
      {
        Component: OrderList,
        path: "/orders",
      },
      {
        Component: OrderEdit,
        path: "/orders/:id/edit",
      },
    ],
  },
];

const router: Router = createBrowserRouter(routes);

export default router;

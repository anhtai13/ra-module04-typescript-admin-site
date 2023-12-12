import { createAction } from "@reduxjs/toolkit";
import { PayloadActionCreator } from "@reduxjs/toolkit/src/createAction";

const setAuthAction: PayloadActionCreator<string> = createAction("SET_AUTH");

const loginAction: PayloadActionCreator<string> = createAction("AUTH_LOGIN");

const logoutAction: PayloadActionCreator<undefined> =
  createAction("AUTH_LOGOUT");

export { loginAction, logoutAction, setAuthAction };

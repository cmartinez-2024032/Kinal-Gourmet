import api from "./api";

const res = await ordersApi.getOrders();

const res = await ordersApi.getOrderById(id);

await ordersApi.cancelOrder(id);
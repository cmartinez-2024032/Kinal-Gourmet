import axios from "axios";

const API = "/promotions";

export const getPromotionsRequest   = () => axios.get(API);
export const createPromotionRequest = (data) => axios.post(API, data);
export const updatePromotionRequest = (id, data) => axios.put(`${API}/${id}`, data);
export const deletePromotionRequest = (id) => axios.delete(`${API}/${id}`);
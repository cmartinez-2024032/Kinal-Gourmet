import { axiosRestaurante } from "./api"

export const getTablesRequest = (params) =>
    axiosRestaurante.get("/kinalGourmetHouse/v1/tables/", { params })
export const getTableByIdRequest = (id) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/tables/${id}`)

export const createTableRequest = (data) =>
    axiosRestaurante.post("/kinalGourmetHouse/v1/tables/create", data)

export const updateTableRequest = (id, data) =>
    axiosRestaurante.put(`/kinalGourmetHouse/v1/tables/${id}`, data)

export const deleteTableRequest = (id) =>
    axiosRestaurante.delete(`/kinalGourmetHouse/v1/tables/${id}`)
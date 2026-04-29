import { axiosPlatillos } from "./api"

export const getTablesRequest = () =>
    axiosPlatillos.get("/kinalGourmetHouse/v1/tables/")

export const getTableByIdRequest = (id) =>
    axiosPlatillos.get(`/kinalGourmetHouse/v1/tables/${id}`)

export const createTableRequest = (data) =>
    axiosPlatillos.post("/kinalGourmetHouse/v1/tables/create", data)

export const updateTableRequest = (id, data) =>
    axiosPlatillos.put(`/kinalGourmetHouse/v1/tables/${id}`, data)

export const deleteTableRequest = (id) =>
    axiosPlatillos.delete(`/kinalGourmetHouse/v1/tables/${id}`)
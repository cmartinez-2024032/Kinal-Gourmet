import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3006/kinalGourmetHouse/v1"
});

export const getDashboardSummary = async () => {

    const token = localStorage.getItem("token");

    const res = await api.get("/dashboard/summary", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};
import { useState } from "react";

const API_URL = "http://localhost:3006/kinalGourmetHouse/v1/promotions";

export const UsePromotionStore = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const getPromotions = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("PROMOTIONS:", data); 

      setPromotions(data.data || []);
    } catch (error) {
      console.log("ERROR GET:", error);
    } finally {
      setLoading(false);
    }
  };

 const createPromotion = async (promotion) => {
  try {
    const res = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(promotion),
    });

    const data = await res.json();

    console.log("CREATE:", data); 

    if (!res.ok) {
      throw new Error(data.message || "Error al crear promoción");
    }

    return data;
  } catch (error) {
    console.log("ERROR CREATE:", error.message);
  }
};

  const updatePromotion = async (id, promotion) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(promotion),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("ERROR UPDATE:", error);
    }
  };

  const deletePromotion = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("ERROR DELETE:", error);
    }
  };

  return {
    promotions,
    loading,
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
};
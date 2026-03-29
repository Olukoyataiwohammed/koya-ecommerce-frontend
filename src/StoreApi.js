export const API_BASE_URL = "http://localhost:8000/";

/* ==============================
   CATEGORIES
================================ */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}store/categories/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/* ==============================
   BRANDS
================================ */
export const fetchBrands = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}store/brands/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

/* ==============================
   PRODUCTS
================================ */
export const fetchProducts = async (authToken = null) => {
  const headers = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}store/products/`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Products error: ${response.status}`);
  }

  return response.json();
};



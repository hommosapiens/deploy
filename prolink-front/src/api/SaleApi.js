const BASE_URL = "https://deploy-one-plum.vercel.app/sale";

export const getAllSales = async () => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/all`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return res.json();
};

export const saveSale = async (process) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(process),
    });
    return res.json();
};

export const updateSale = async (process) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(process),
    });
    return res.json();
};

export const deleteSaleById = async (id) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Error al eliminar la venta");
    }
};

const BASE_URL = "https://deploy-one-plum.vercel.app/product";

export const getAllProducts = async () => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/all`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return res.json();
};

export const saveProduct = async (process) => {
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

export const saveAllProducts = async (process) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/saveAll`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(process),
    });
    return res.json();
};

export const updateProduct = async (process) => {
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

export const deleteProductById = async (id) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Error al eliminar el proceso");
    }
};

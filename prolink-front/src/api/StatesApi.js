const BASE_URL = "https://deploy-dhsk.onrender.com/state";


export const getAllStates = async () => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/all`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return res.json();
};

export const saveState = async (state) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(state),
    });
    return res.json();
};

export const updateState = async (state) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(state),
    });
    return res.json();
};

export const deleteStateById = async (id) => {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Error al eliminar el estado");
    }
};

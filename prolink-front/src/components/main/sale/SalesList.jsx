import React, {useContext, useEffect, useState} from 'react';
import SaleCard from "./SaleCard.jsx";
import {FiPlus} from "react-icons/fi";
import SaleProcessor from "../../utils/SaleProcessor.js";
import SaleModal from "./SaleModal.jsx";
import {deleteSaleById, getAllSales, updateSale} from "../../../api/SaleApi.js";
import webSocket from "../../../websocket/WebSocket.js";
import {UserContext} from "../user/UserProvider.jsx";

export const SalesList = () => {
    const [sales, setSales] = useState([]);

    const processor = new SaleProcessor();
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState(null);

    const {role} = useContext(UserContext);

    useEffect(() => {
        getAllSales()
            .then(setSales)
            .catch((err) => console.error("On find all Sales", err))
    }, [])

    const handleAdd = (e) => {
        const file = e.target.files[0];
        processor.processFile(file, (result) => {
            setData(result);
            setShowModal(true);
        });
        e.target.value = null;
    }

    const onUpdate = async (entity) => {
        try {
            const res = await updateSale(entity);
            console.log("Successfully updated: ", res);
        } catch (err) {
            console.error("On update StateCard:", err);
        }
    };

    const handleWebSocketUpdate = (entrySales) => {
        setSales(prev => {
            const exists = prev.some(s => s.id.toString() === entrySales.id.toString());
            if (exists) {
                return prev.map(s => s.id.toString() === entrySales.id.toString() ? entrySales : s);
            } else {
                return [...prev, entrySales];
            }
        });
    };

    const handleWebSocketDelete = (deletedId) => {
        setSales(prev => prev.filter(s => s.id.toString() !== deletedId.toString()));
    };

    webSocket(handleWebSocketUpdate, handleWebSocketDelete, "sale");

    const onDelete = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmed) {
            try {
                const res = await deleteSaleById(id);
                setSales(prev => prev.filter(sale => sale.id !== id));
                console.log("Successfully deleted process " + id + ", res: " + res);
            } catch (err) {
                console.error("On delete Process:", err);
            }
        }
    };

    return (
        <div
            id={"sale-list"}
            className="flex flex-col items-center border border-neutral-500 rounded-t-lg p-8 bg-neutral-800 min-h-screen"
        >

            {/*Label*/}
            <div className="px-8 pt-8">
                <h2 className="text-3xl text-white font-semibold border-b-2 w-48 mb-6 text-center">
                    Pedidos{''}
                    {(role === "ADMIN" || role === "SUPERVISOR") && (
                        <>
                            <label
                                htmlFor="fileUpload"
                                className="absolute top-24 right-6 m-4 border border-neutral-500 text-white rounded-full p-2 hover:bg-neutral-600 transition-all duration-300 ease-in-out cursor-pointer"
                                title="Seleccionar archivo"
                            >
                                <FiPlus/>
                            </label>
                            <input
                                id="fileUpload"
                                type="file"
                                accept=".xls,.xlsx"
                                className="hidden"
                                onChange={handleAdd}
                            />
                        </>
                    )}
                </h2>
            </div>

            {/*Content*/}
            <div className="w-full overflow-auto max-h-[calc(100vh-190px)] custom-scrollbar ">
                <div className="w-full p-8">
                    {sales.map((outSale) => (
                        <SaleCard
                            key={outSale.id}
                            outSale={outSale}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>

            {showModal && (
                <SaleModal data={data} onClose={() => setShowModal(false)}/>
            )}

        </div>
    );

};

SalesList.propTypes = {}

export default SalesList;
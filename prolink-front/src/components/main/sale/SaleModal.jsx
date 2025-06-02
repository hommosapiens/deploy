import React from 'react';
import PropTypes from "prop-types";
import {saveSale} from "../../../api/SaleApi.js";

export const SaleModal = ({data, onClose}) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="bg-neutral-700 text-white rounded-lg shadow-lg w-full max-w-[50%] max-h-[90vh] overflow-y-auto p-6 relative"
            >
                <button
                    className="absolute top-4 right-4 text-white hover:text-gray-500 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <div className="p-4">
                    <h3 className="font-semibold mb-2 text-lg">Observaciones</h3>
                    <p><strong>Pedido:</strong> {data.code}</p>
                    <p><strong>Cliente:</strong> {data.client}</p>
                    <p><strong>F.Ini:</strong> {data.initDate} <strong>F.Ent:</strong> {data.endDate}</p>

                    <h3 className="font-semibold mt-6 mb-2 text-lg">Productos</h3>
                    {data?.products?.map((products, idx) => (
                        <div key={idx} className="border rounded p-4 mb-4 bg-neutral-600">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="block font-medium">{products.id}</span>
                                    <span className="block">{products.description}</span>
                                    <span className="block">Cantidad: {products.amount}</span>
                                </div>
                            </div>

                            {products.components.length > 0 && (
                                <div
                                    className={`max-h-screen mt-4' : 'max-h-0'`}
                                >
                                    <p className="font-medium">Componentes:</p>
                                    <ul className="list-disc list-inside">
                                        {products.components.map((comp, i) => (
                                            <li key={i}>
                                                <span
                                                    className="font-semibold">{comp.id}
                                                </span>: {comp.description} (Cantidad: {comp.amount})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    className="border-2 border-green-500 text-green-500 font-semibold px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition ml-4"
                    onClick={() => {
                        try {
                            console.log("Saving sale: ", data);
                            const res = saveSale(data);
                            console.log("Successfully saved: ", res);
                            onClose();
                        } catch (err) {
                            console.error("On save SaleCard:", err);
                        }
                    }}
                >
                    Guardar
                </button>
            </div>
        </div>);

};

SaleModal.propTypes = {
    data: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default SaleModal;
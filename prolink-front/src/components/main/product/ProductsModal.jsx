import React from 'react';
import PropTypes from "prop-types";
import {saveAllProducts} from "../../../api/ProductApi.js";

export const ProductsModal = ({data, onClose}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="bg-neutral-700 text-white rounded-lg shadow-lg w-full max-w-[80%] max-h-[90vh] overflow-y-auto p-6 relative"
            >
                <button
                    className="absolute top-4 right-4 text-white hover:text-gray-500 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <div className="p-4">
                    <h3 className="font-semibold mb-2 text-lg">Productos cargados</h3>

                    {data.map((row) => (
                        <div key={row.id} className="border rounded p-4 mb-4 bg-neutral-600">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="block font-medium">Código: {row.id}</span>
                                    <span className="block">Descripción: {row.description}</span>
                                    <span className="block">Proceso: {row.process}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="border-2 border-green-500 text-green-500 font-semibold px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition ml-4"
                    onClick={() => {
                        try {
                            console.log("Saving sale: ", data);
                            const res = saveAllProducts(data);
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
        </div>
    );
};

ProductsModal.propTypes = {
    data: PropTypes.arrayOf(PropTypes.array).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProductsModal;

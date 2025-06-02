import React, {useContext, useEffect, useRef, useState} from "react";
import {MdDelete, MdMode} from "react-icons/md";
import PropTypes from "prop-types";
import {supressText} from "../../utils/SupressText.js";
import ProcessOnProductCard from "../process/ProcessOnProductCard.jsx";
import {UserContext} from "../user/UserProvider.jsx";

export const ProductCard = ({outProduct, onSave, onUpdate, onDelete}) => {
    const prevProduct = outProduct;
    const [process, setProcess] = useState(outProduct.process);

    const [isEditing, setIsEditing] = useState(outProduct.isNew || false);
    const [description, setDescription] = useState(outProduct.description);

    const spanRef = useRef(null);
    const [inputWidth, setInputWidth] = useState(0);

    const {role} = useContext(UserContext);


    // Ajusta el ancho del input segun el contenido
    useEffect(() => {
        if ((isEditing || outProduct.isNew) && spanRef.current) {
            const newWidth = spanRef.current.offsetWidth + 12; // padding adjustment
            setInputWidth(newWidth);
        }
    }, [description, isEditing, outProduct.isNew]);

    useEffect(() => {
        setProcess(outProduct.process);
        setDescription(outProduct.description);
    }, [outProduct]);

    const saveOrUpdate = () => {
        setIsEditing(false);
        const updatedProduct = {
            ...outProduct,
            description,
            process,
        };
        if (outProduct.isNew) {
            onSave(updatedProduct);
        } else {
            onUpdate(updatedProduct);
        }
    }


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const onCancel = () => {
        setIsEditing(false);
        setDescription(prevProduct.description);
        setProcess(prevProduct.process);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") saveOrUpdate();
    };

    return (
        <div className="bg-neutral-800 p-6 rounded-2xl shadow border border-neutral-600 mt-4">
            {/* Description row */}
            <div className="flex items-center mb-4 relative">
                <span className="text-xl font-bold text-teal-500">{outProduct.id}</span>
                {isEditing || outProduct.isNew ? (
                    <>
                        <input
                            type="text"
                            className="text-white bg-neutral-800 border border-neutral-400 rounded px-2 ml-2 focus:outline-none"
                            style={{width: `${inputWidth}px`, maxWidth: "100%"}}
                            autoFocus
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                const value = e.target.value;
                                setDescription(prev =>
                                    supressText(prev, value, "Nuevo producto")
                                );
                            }}
                            value={description.toString()}
                        />
                        <span
                            ref={spanRef}
                            className="absolute invisible whitespace-pre text-base font-normal px-2"
                        >
                            {description}
                        </span>
                    </>
                ) : (
                    <span className="text-xl font-semibold text-white ml-2">
                        {outProduct.description}
                    </span>
                )}

                {role === "ADMIN" && (
                    <>
                        {!isEditing && !outProduct.isNew && (
                            <button
                                className="ml-2 text-purple-500 hover:text-purple-300 rounded-xl px-2 py-1"
                                title="Modificar"
                                onClick={handleEditClick}
                            >
                                <MdMode size={20}/>
                            </button>
                        )}
                        <button
                            className="text-red-500 ml-auto hover:text-red-300"
                            onClick={() => onDelete(outProduct.id)}
                            title="Eliminar"
                        >
                            <MdDelete size={20}/>
                        </button>
                    </>
                )}
            </div>

            {/* Process row */}
            <div className="flex flex-wrap items-center gap-2">
                <ProcessOnProductCard
                    process={process}
                    isEditing={isEditing}
                    setProcess={setProcess}
                />

            </div>

            {/*Save Cancel row*/}
            {isEditing && (
                <div className="flex items-center justify-between md:justify-start gap-4 mt-4">
                    <button
                        className="border-2 border-green-500 text-green-500 font-semibold px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition"
                        onClick={() => saveOrUpdate()}
                    >
                        Guardar
                    </button>
                    <button
                        className="border-2 border-red-500 text-red-500 font-semibold px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};

ProductCard.propTypes = {
    outProduct: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ProductCard;
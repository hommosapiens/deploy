import React, {useContext, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
import {AnimatePresence, motion} from "framer-motion";
import ProductOnSaleCard from "../product/ProductOnSaleCard.jsx";
import {MdDelete} from "react-icons/md";
import {UserContext} from "../user/UserProvider.jsx";


export const SaleCard = ({outSale, onUpdate, onDelete}) => {
    const [sale, setSale] = useState(outSale);
    const [isOpen, setIsOpen] = useState(false);
    const [productionUnits, setProductionUnits] = useState(outSale.productionUnits);
    const [isOutEditing, setIsOutEditing] = useState(false);
    const {role} = useContext(UserContext);

    useEffect(() => {
        setSale(outSale);
    }, [outSale]);

    useEffect(() => {
        setProductionUnits(sale.productionUnits);
    }, [sale]);

    const transformProductionUnits = (units) => {
        const grouped = {};

        units.forEach(unit => {
            const key = unit.description;

            if (!grouped[key]) {
                grouped[key] = {
                    description: key,
                    amount: 0,
                    onProduction: []
                };
            }

            grouped[key].amount++;
            grouped[key].onProduction.push({
                id: unit.id,
                description: unit.description,
                carriage: unit.carriage,
                process: unit.process
            });
        });

        // Genera el array final, eligiendo como "representativo" el primero del grupo
        return Object.values(grouped).map(group => {
            const first = group.onProduction[0];

            return {
                id: first.id,
                description: first.description,
                amount: group.amount,
                onProduction: group.onProduction
            };
        });
    };

    const update = () => {
        setIsOutEditing(false);
        const updateSale = {
            ...sale,
            productionUnits,
        };
        onUpdate(updateSale);
    }

    const updateProductionUnit = (productionUnit) => {
        setProductionUnits(prev =>
            prev.map(p => p.id !== productionUnit.id ? p : productionUnit)
        );
    };

    return (
        <div className="bg-neutral-700 p-6 rounded-2xl shadow border border-neutral-600 mt-6 w-full">
            {/* Description row */}
            <div className="flex flex-col md:flex-row md:items-center w-full text-center md:text-left">
                <button
                    className="flex flex-col md:flex-row md:items-center w-full text-center md:text-left"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{isOpen ? <IoMdArrowDropup size={25}/> : <IoMdArrowDropdown size={25}/>}</span>
                    <span className="text-xl font-bold text-cyan-300 ml-2">{sale.code}</span>
                    <span className="text-xl font-semibold ml-4 md:mr-auto">{sale.client}</span>
                    <span className="text-xl font-semibold md:mr-10">{sale.initDate}</span>
                    <span className="text-xl font-semibold md:mr-10">{sale.endDate}</span>
                </button>
                {(role === "ADMIN" || role === "SUPERVISOR") && (
                    <button
                        className="text-red-500 hover:text-red-300"
                        title="Eliminar"
                        onClick={() => onDelete(sale.id)}
                    >
                        <MdDelete size={20}/>
                    </button>
                )}
            </div>


            {/* ProductCard rows */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 mt-4">
                            {transformProductionUnits(productionUnits).map((productionUnit) => (
                                <ProductOnSaleCard
                                    key={productionUnit.id}
                                    productionUnit={productionUnit}
                                    setIsOutEditing={setIsOutEditing}
                                    updateProductionUnit={updateProductionUnit}
                                />
                            ))}
                        </div>
                        {/*Save Cancel row*/}
                        {isOutEditing && (
                            <div className="flex items-center justify-between md:justify-start gap-4 mt-4">
                                <button
                                    className="border-2 border-green-500 text-green-500 font-semibold px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition"
                                    onClick={() => update()}
                                >
                                    Guardar
                                </button>
                                <button
                                    className="border-2 border-red-500 text-red-500 font-semibold px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

SaleCard.propTypes = {
    outSale: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default SaleCard;
import React, {useState} from 'react';
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
import PropTypes from "prop-types";
import ProductionUnitCard from "./ProductionUnitCard.jsx";
import {AnimatePresence, motion} from "framer-motion";

export const ProductOnSaleCard = ({productionUnit, setIsOutEditing, updateProductionUnit}) => {
    const [isOpen, setIsOpen] = useState(false);
    const components = productionUnit.components;
    const onProduction = productionUnit.onProduction;

    return (
        <div>

            {/* ProductCard */}
            <div className="border border-neutral-500 rounded-xl p-4 bg-neutral-600">

                {/* Description */}
                <button
                    className="flex flex-row justify-between w-full"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="text-white font-bold ">{productionUnit.id}</span>
                    <span className=" font-semibold ml-4">{productionUnit.description}</span>
                    <span className=" text-neutral-200 ml-auto">{productionUnit.amount}</span>
                    <span className="ml-4">{isOpen ? (<IoMdArrowDropdown size={25}/>) : (
                        <IoMdArrowDropup size={25}/>)}</span>
                </button>

                {/* Components */}
                <div className="overflow-hidden pl-4 border-l-2 border-teal-500 mt-2">
                    <div>
                        <h4 className="text-teal-400 font-bold mb-2">Componentes:</h4>
                        <ul className="space-y-1 list-disc marker:text-teal-400">
                            {components?.map((component,) => (
                                <li key={component.id} className="ml-4 text-neutral-200">
                                    <span className="font-bold">{component.id}</span>
                                    <span className="font-semibold ml-4">{component.description}</span>
                                    <span className="ml-4">{component.amount}.</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Products on factory */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                        className="overflow-hidden"
                    >
                        <div>
                            {Array.from({length: parseInt(productionUnit.amount)}).map((_, i) => {
                                const prod = onProduction[i];
                                if (!prod) return null;
                                return (
                                    <div key={prod.id} className="text-white">
                                        <ProductionUnitCard
                                            onProduction={prod}
                                            setIsOutEditing={setIsOutEditing}
                                            updateProductionUnit={updateProductionUnit}
                                        />
                                    </div>
                                );
                            })}
                        </div>


                    </motion.div>
                )}
            </AnimatePresence>

        </div>);

};

ProductOnSaleCard.propTypes = {
    productionUnit: PropTypes.object.isRequired,
    setIsOutEditing: PropTypes.func.isRequired,
    updateProductionUnit: PropTypes.func.isRequired,
}

export default ProductOnSaleCard;
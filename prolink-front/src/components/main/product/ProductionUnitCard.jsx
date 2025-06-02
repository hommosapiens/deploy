import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {handleClick, setColor, supressText} from "../../utils/SupressText.js";
import {MdMode} from "react-icons/md";

export const ProductionUnitCard = ({onProduction, setIsOutEditing, updateProductionUnit}) => {

    const [process, setProcess] = useState(onProduction.process);
    const [states, setStates] = useState(process.states);
    const [isEditing, setIsEditing] = useState(false);
    const [carriage, setCarriage] = useState(onProduction.carriage);

    useEffect(() => {
        setProcess(onProduction.process);
        setCarriage(onProduction.carriage);
    }, [onProduction]);

    useEffect(() => {
        setStates(process.states);
    }, [process])

    const updateCarriage = (e) => {
        const value = e.target.value;
        setCarriage(prev =>
            supressText(prev, value, "NA")
        );
    }

    const updateProcess = (index) => {
        const newProcess = {
            ...process,
            states: handleClick(index, states),
        }
        setIsOutEditing(true);
        setProcess(newProcess);

        const newProductUnit = {
            id: onProduction.id,
            carriage: carriage,
            description: onProduction.description,
            process: newProcess,
        }
        updateProductionUnit(newProductUnit)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            const newProductUnit = {
                id: onProduction.id,
                carriage: carriage,
                description: onProduction.description,
                process: process,
            }
            updateProductionUnit(newProductUnit)
        }
    };

    return (
        <div className="bg-neutral-600 p-6 shadow border border-neutral-500 w-[98%] mx-auto">
            <div className="flex items-center">


                {isEditing ? (
                    <input
                        type="text"
                        className="text-white bg-neutral-800 border border-neutral-400 rounded px-2 ml-2 w-12 focus:outline-none"
                        autoFocus
                        onChange={updateCarriage}
                        value={carriage.toString()}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <span
                        className="text-lime-400 font-bold"
                        title="Carro"
                    >
                        {carriage}
                    </span>
                )}

                <span
                    className="font-semibold ml-2"
                    title="Descripcion"
                >
                    {onProduction.description}
                </span>

                {!isEditing && (
                    <button
                        className="ml-2 text-purple-500 hover:text-purple-300 rounded-xl px-2 py-1"
                        title="Modificar"
                        onClick={() => {
                            setIsEditing(true);
                            setIsOutEditing(true);
                        }}
                    >
                        <MdMode size={20}/>
                    </button>
                )}

            </div>
            <div className="flex items-center relative">
                <span className="text-xl font-semibold text-white">

                </span>
                <div className="flex flex-wrap items-center gap-2" title="Proceso">
                    <span className="font-semibold text-white">
                        {process?.description}
                    </span>
                    <div className="border-l-2 flex flex-wrap items-center ml-2">
                        {states?.map((state, index) => (
                            <button
                                key={state.id}
                                className="font-semibold inline-flex items-center p-2"
                                onClick={() => {
                                    updateProcess(index)
                                }}
                            >
                            <span className={`${setColor(state.status)} font-bold px-3 py-1 rounded-full mr-2`}>
                                {index + 1}
                            </span>
                                {state.description}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>)
        ;
};


ProductionUnitCard.propTypes = {
    onProduction: PropTypes.object.isRequired,
    setIsOutEditing: PropTypes.func.isRequired,
    updateProductionUnit: PropTypes.func.isRequired,
};

export default ProductionUnitCard;
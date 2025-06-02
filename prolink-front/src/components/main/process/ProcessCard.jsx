import React, {useContext, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import PropTypes from "prop-types";
import {MdDelete, MdMode} from "react-icons/md";
import {RxCross2} from "react-icons/rx";
import {FiPlus} from "react-icons/fi";
import {UserContext} from "../user/UserProvider.jsx";
import {getAllStates} from "../../../api/StatesApi.js";

export const ProcessCard = ({outProcess, onSave, onUpdate, onDelete}) => {
    const [process, setProcess] = useState(outProcess);
    const [editedDescription, setEditedDescription] = useState(process.description);
    const [states, setStates] = useState(outProcess.states);
    const [isEditing, setIsEditing] = useState(outProcess.isNew);
    const [allStates, setAllStates] = useState([]);
    const [availableStates, setAvailableStates] = useState([]);
    const [showSelector, setShowSelector] = useState(false);

    const {role} = useContext(UserContext);

    // Ref para el botón que abre el dropdown
    const buttonRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({top: 0, left: 0, width: 0});

    useEffect(() => {
        setProcess(outProcess);
        setEditedDescription(outProcess.description);
        setStates(outProcess.states);
        getAllStates().then(setAllStates);
    }, [outProcess]);

    useEffect(() => {
        setAvailableStates(allStates.filter((state) => !states.some((s) => s.id === state.id)));
    }, [allStates, states]);

    const saveOrUpdate = () => {
        setIsEditing(false);
        if (process.isNew) {
            const saveProcess = {
                ...process,
                description: editedDescription,
                states,
            };
            onSave(saveProcess);
        } else {
            const updateProcess = {
                ...process,
                description: editedDescription,
                states,
            };
            onUpdate(updateProcess);
        }
    };

    const handleAddState = (state) => {
        setStates((prev) => [...prev, state]);
        setShowSelector(false);
    };

    const handleRemoveState = (id) => {
        setStates((prevStates) => prevStates.filter((s) => s.id !== id));
    };

    // Al abrir el selector, calculamos la posición para el dropdown
    const toggleSelector = () => {
        if (!showSelector && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
        setShowSelector(!showSelector);
    };

    return (
        <div className="bg-neutral-800 p-6 rounded-2xl shadow border border-neutral-600 mt-4">
            {/* Description row */}
            <div className="flex items-center mb-4">
                <span className="text-xl font-bold text-teal-500 ">{process.id}</span>
                {isEditing || process.isNew ? (
                    <input
                        type="text"
                        className="text-white bg-neutral-800 border border-neutral-400 rounded px-2  focus:outline-none"
                        value={editedDescription}
                        autoFocus
                        onChange={(e) => setEditedDescription(e.target.value)}
                    />
                ) : (
                    <span className="text-xl font-semibold text-white ml-2">{process.description}</span>
                )}

                {role === "ADMIN" && (
                    <>
                        {!isEditing && (
                            <button
                                className="ml-2 text-purple-500 hover:text-purple-300 rounded-xl px-2 py-1"
                                title="Modificar"
                                onClick={() => setIsEditing(true)}
                            >
                                <MdMode size={20}/>
                            </button>
                        )}

                        <button
                            className="text-red-500 ml-auto hover:text-red-300"
                            title="Eliminar"
                            onClick={() => onDelete(process.id)}
                        >
                            <MdDelete size={20}/>
                        </button>
                    </>
                )}
            </div>

            {/* States row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {states.map((state, index) => (
                    <span
                        key={state.id}
                        className="bg-neutral-300 text-black font-bold px-3 py-1 rounded-full inline-flex items-center gap-2 mr-2 mb-2"
                    >
            {index + 1 + ". "}
                        {state.description}
                        {isEditing && (
                            <button
                                type="button"
                                className=" text-red-500  hover:text-red-600 font-bold w-5 h-5 flex items-center justify-center transition-all duration-300 ease-in-out"
                                aria-label={`Eliminar ${state.description}`}
                                onClick={() => handleRemoveState(state.id)}
                            >
                                <RxCross2/>
                            </button>
                        )}
          </span>
                ))}

                {isEditing && (
                    <div className="relative">
                        <button
                            ref={buttonRef}
                            className="bg-blue-600 text-white text-sm px-3 rounded-full hover:bg-blue-700 transition justify-center h-8"
                            onClick={toggleSelector}
                        >
                            <FiPlus/>
                        </button>

                        {showSelector &&
                            createPortal(
                                <div
                                    className="fixed z-50 bg-neutral-800 rounded border border-neutral-600 text-white shadow-lg"
                                    style={{
                                        top: dropdownPosition.top,
                                        left: dropdownPosition.left,
                                        maxHeight: 200,
                                        width: 'auto',
                                        minWidth: 150,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        className="border-b border-neutral-600 text-center px-4 py-2 font-semibold sticky top-0 bg-neutral-800 z-10">
                                        Estados
                                    </div>
                                    <ul className="overflow-auto" style={{maxHeight: 160}}>
                                        {availableStates.map((state) => (
                                            <li key={state.id}>
                                                <button
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                                                    onClick={() => handleAddState(state)}
                                                >
                                                    {state.description}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>,
                                document.body
                            )}


                    </div>
                )}
            </div>

            {/* Save Cancel row */}
            {isEditing && (
                <div className="flex item-center justify-between md:justify-start gap-4">
                    <button
                        className="border-2 border-green-500 text-green-500 font-semibold px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition"
                        onClick={() => saveOrUpdate()}
                    >
                        Guardar
                    </button>
                    <button
                        className="border-2 border-red-500 text-red-500 font-semibold  px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                        onClick={() => {
                            setEditedDescription(process.description);
                            setStates(process.states);
                            setIsEditing(false);
                            setShowSelector(false);
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};

ProcessCard.propTypes = {
    outProcess: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ProcessCard;

import React, {useContext, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {MdDelete, MdMode} from "react-icons/md";
import {FaCheck} from "react-icons/fa";
import {UserContext} from "../user/UserProvider.jsx";

export const StateCard = ({outState, onSave, onUpdate, onDelete}) => {
    const [state, setState] = useState(outState);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(state.description);
    const {role} = useContext(UserContext);

    useEffect(() => {
        setState(outState);
        setEditedDescription(outState.description);
    }, [outState]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleOnTickButton = () => {
        const callback = state.isNew ? onSave : onUpdate;
        saveOrUpdate(callback);
    };

    const saveOrUpdate = (callback) => {
        setIsEditing(false);
        if (editedDescription !== state.description && editedDescription !== "") {
            const updatedState = {
                ...state,
                description: editedDescription,
                isNew: false
            };
            callback(updatedState);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleOnTickButton();
        }
    };

    return (
        <div
            id={`state-template-${state.id}`}
            key={state.id}
            className="p-6 border border-neutral-600 rounded-lg shadow-lg hover:bg-neutral-700 transition-all duration-300 ease-in-out"
        >
            <div className="flex items-center justify-between gap-4">
                <span className="text-xl font-bold text-teal-500 p-1">{state.id}</span>

                {isEditing || state.isNew ? (
                    <input
                        type="text"
                        className="text-white bg-neutral-800 border border-neutral-400 rounded px-2 py-1 w-full max-w-xs focus:outline-none"
                        value={editedDescription.toString()}
                        autoFocus
                        onChange={(e) => setEditedDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <span className={`text-white text-xl ${role !== "ADMIN" ? "mr-auto" : ""}`}>
                        {state.description}
                    </span>
                )}

                {role === "ADMIN" && (
                    <>
                        {isEditing || state.isNew ? (
                            <button
                                className="text-green-400 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleOnTickButton}
                                title="Guardar"
                                aria-label="Guardar cambios"
                                disabled={editedDescription.trim() === "" || editedDescription === state.description}
                            >
                                <FaCheck size={20}/>
                            </button>

                        ) : (
                            <button
                                className="ml-auto text-purple-500 hover:text-purple-300"
                                onClick={handleEditClick}
                                title="Modificar"
                            >
                                <MdMode size={20}/>
                            </button>
                        )}

                        <button
                            className="text-red-500 hover:text-red-300"
                            onClick={() => onDelete(state.id)}
                            title="Eliminar"
                        >
                            <MdDelete size={20}/>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

StateCard.propTypes = {
    outState: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default StateCard;

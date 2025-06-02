import React, {useContext, useEffect, useState} from 'react';
import StateCard from "./StateCard.jsx";
import {FiPlus} from "react-icons/fi";
import {deleteStateById, getAllStates, saveState, updateState} from "../../../api/StatesApi.js";
import webSocket from "../../../websocket/WebSocket.js";
import "../Body.css"
import {UserContext} from "../user/UserProvider.jsx";

const NEW_STATE = {id: "", description: '', status: 'NONE', isNew: true};

const StatesList = () => {
    const [states, setStates] = useState([]);
    const {role} = useContext(UserContext);

    useEffect(() => {
        getAllStates()
            .then(setStates)
            .catch((err) => console.error("On find all StateCard:", err))
    }, []);

    const handleWebSocketUpdate = (entryState) => {
        setStates(prev => {
            const exists = prev.some(s => s.id === entryState.id);
            if (exists) {
                return prev.map(s => s.id === entryState.id ? entryState : s);
            } else {
                return [...prev, entryState];
            }
        });
    };

    const handleWebSocketDelete = (deletedId) => {
        console.log("AAAAA: " + deletedId);
        setStates(prev => prev.filter(s => s.id !== Number(deletedId)));
    };

    webSocket(handleWebSocketUpdate, handleWebSocketDelete, "states");

    const onSave = async (StateData) => {
        const entity = {
            description: StateData.description,
            status: StateData.status,
        };
        try {
            const res = await saveState(entity);
            console.log("Successfully saved: ", res);
            setStates(prev => prev.filter(s => s.isNew !== true));
        } catch (err) {
            console.error("On save StateCard:", err);
        }
    };

    const onUpdate = async (StateData) => {
        const entity = {
            id: StateData.id,
            description: StateData.description,
            status: StateData.status,
        };

        try {
            const res = await updateState(entity);
            console.log("Successfully updated: ", res);
        } catch (err) {
            console.error("On update StateCard:", err);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este estado?");
        if (confirmed) {
            try {
                const res = await deleteStateById(id);
                setStates(prevStates => prevStates.filter(state => state.id !== id));
                console.log("Successfully deleted state " + id + ", res: " + res);
            } catch (err) {
                console.error("On delete StateCard:", err);
            }
        }
    };

    const handleAddLocalState = () => {
        if (!states[states.length - 1].isNew) {
            setStates((prev) => [...prev, NEW_STATE]);
        }
    };

    return (
        <div
            id={"StateList"}
            className="flex flex-col items-center border border-neutral-500 rounded-t-lg min-h-screen bg-neutral-800 "
        >
            {/* Label */}
            <div className="px-8 pt-8">
                <h2 className="text-3xl text-white font-semibold border-b-2 w-80 mb-6 text-center">
                    Plantilla de estados{''}
                    {role === "ADMIN" && (
                        <button
                            className=" absolute top-24 right-6 m-4 border border-neutral-500 text-white rounded-full p-2 hover:bg-neutral-600 transition-all duration-300 ease-in-out"
                            onClick={handleAddLocalState}
                            title="Agregar nuevo estado"
                        >
                            <FiPlus/>
                        </button>
                    )}
                </h2>
            </div>

            {/*Content*/}
            <div className="w-full overflow-auto max-h-[calc(100vh-190px)] custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 ">
                    {states.map((outState) => (
                        <StateCard
                            key={outState.id}
                            outState={outState}
                            onSave={onSave}
                            onUpdate={onUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatesList;
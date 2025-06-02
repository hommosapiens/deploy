import React, {useContext, useEffect, useState} from 'react';
import {FiPlus} from "react-icons/fi";
import ProcessCard from "./ProcessCard.jsx";
import {deleteProcessById, getAllProcess, saveProcess, updateProcess} from "../../../api/ProcessApi.js";
import webSocket from "../../../websocket/WebSocket.js";
import {UserContext} from "../user/UserProvider.jsx";

export const ProcessList = () => {
    const [processes, setProcesses] = useState([]);
    const NEW_PROCESS = {id: "", description: "", states: [], isNew: true};
    const {role} = useContext(UserContext);

    useEffect(() => {
        getAllProcess()
            .then(setProcesses)
            .catch((err) => console.error("On find all process", err))
    }, [])

    const handleWebSocketUpdate = (entryProcess) => {
        setProcesses(prev => {
            const exists = prev.some(s => s.id.toString() === entryProcess.id.toString());
            if (exists) {
                return prev.map(s => s.id.toString() === entryProcess.id.toString() ? entryProcess : s);
            } else {
                return [...prev, entryProcess];
            }
        });
    };

    const handleWebSocketDelete = (deletedId) => {
        setProcesses(prev => prev.filter(s => s.id.toString() !== deletedId.toString()));
    };

    webSocket(handleWebSocketUpdate, handleWebSocketDelete, "process");

    const handleAddLocalProcess = () => {
        setProcesses((prev) => [...prev, NEW_PROCESS]);
    };

    const onSave = async (processData) => {
        const entity = {
            description: processData.description.toString(),
            states: processData.states,
        };
        try {
            const res = await saveProcess(entity);
            console.log("Successfully saved: ", res);
            setProcesses(prev => prev.filter(s => s.isNew !== true));
        } catch (err) {
            console.error("On save StateCard:", err);
        }
    };

    const onUpdate = async (ProcessData) => {
        const entity = {
            id: ProcessData.id,
            description: ProcessData.description.toString(),
            states: ProcessData.states,
        };
        try {
            const res = await updateProcess(entity);
            console.log("Successfully updated: ", res);
        } catch (err) {
            console.error("On update StateCard:", err);
        }
    };

    const onDelete = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este proceso?");
        if (confirmed) {
            try {
                const res = await deleteProcessById(id);
                setProcesses(prev => prev.filter(process => process.id !== id));
                console.log("Successfully deleted process " + id + ", res: " + res);
            } catch (err) {
                console.error("On delete Process:", err);
            }
        }
    };

    return (
        <div
            id={"ProcessList"}
            className="flex flex-col items-center border border-neutral-500 rounded-t-lg min-h-screen bg-neutral-800 "
        >

            {/*Label*/}
            <div className="px-8 pt-8">
                <h2 className="text-3xl text-white font-semibold border-b-2 w-80 mb-6 text-center">
                    Plantilla de procesos{''}
                    {role === "ADMIN" && (
                        <button
                            className=" absolute top-24 right-6 m-4 border border-neutral-500 text-white rounded-full p-2 hover:bg-neutral-600 transition-all duration-300 ease-in-out"
                            onClick={handleAddLocalProcess}
                            title="Agregar nuevo estado"
                        >
                            <FiPlus/>
                        </button>
                    )}
                </h2>
            </div>

            {/*Content*/}
            <div className="w-full overflow-auto max-h-[calc(100vh-190px)] custom-scrollbar ">
                <div className="w-full p-8">
                    {processes.map((outProcess) => (
                        <ProcessCard
                            key={outProcess.id}
                            outProcess={outProcess}
                            onSave={onSave}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>);

};

ProcessList.propTypes = {}

export default ProcessList;
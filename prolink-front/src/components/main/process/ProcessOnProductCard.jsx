import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {getAllProcess} from "../../../api/ProcessApi.js";

export const ProcessOnProductCard = ({process, isEditing, setProcess}) => {
    const [avaliableProcesses, setAvaliableProcesses] = useState([]);

    useEffect(() => {
        getAllProcess()
            .then(setAvaliableProcesses)
            .catch((err) => console.error("On find all ProcessOnProductCard:", err))
    }, [])

    const selectNewProcess = (e) => {
        const selectedProcess = avaliableProcesses.find(
            (proc) => proc.id === parseInt(e.target.value)
        );
        setProcess(selectedProcess);
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {isEditing ? (
                <select
                    className="bg-neutral-700 text-white border border-neutral-400 rounded px-2 py-1"
                    value={process?.id || ""}
                    onChange={selectNewProcess}
                >
                    <option value="">Seleccione un proceso</option>
                    {avaliableProcesses.map((process) => (
                        <option key={process.id} value={process.id}>
                            {process.description}
                        </option>
                    ))}
                </select>
            ) : (
                <span className="font-semibold text-white">{process?.description}</span>
            )}

            <div className="border-l-2 flex flex-wrap items-center">
                {process?.states.map((state, index) => (
                    <span
                        key={state.id}
                        className="font-semibold inline-flex items-center p-2"
                    >
                        <span className="bg-neutral-300 text-black font-bold px-3 py-1 rounded-full mr-2">
                            {index + 1}
                        </span>
                        {state.description}
                    </span>
                ))}
            </div>
        </div>
    );
};


ProcessOnProductCard.propTypes = {
    process: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setProcess: PropTypes.func.isRequired,
};

export default ProcessOnProductCard;
/**
 * Reemplaza el valor inicial si coincide con un placeholder
 */
export function supressText(prev, value, placeholder) {
    return prev === placeholder ? "" + value.slice(-1) : value;
}

/**
 * Determina si un valor es numérico
 */
export function isNumber(valor) {
    return !isNaN(valor) && valor !== '' && typeof valor !== 'boolean';
}

/**
 * Determina el color del estado, reduce la complejidad
 */
const isBeforeIndex = (i, index) => i < index;
const isAtIndex = (i, index) => i === index;
const isAfterIndex = (i, index) => i > index;

const isInProgress = (state) => state.status === "IN_PROGRESS";
const isDelayed = (state) => state.status === "DELAYED";
const shouldBeDelayed = (status) => ["DONE", "IN_PROGRESS", "DELAYED"].includes(status);

const markAsDone = (state) => state.status = "DONE";
const markAsInProgress = (state) => state.status = "IN_PROGRESS";
const markAsDelayed = (state) => state.status = "DELAYED";
const markAsNone = (state) => state.status = "NONE";

const handleBeforeIndex = (i, updatedStates) => {
    markAsDone(updatedStates[i]);
};

const handleCurrentIndex = (i, updatedStates) => {
    const current = updatedStates[i];
    if (isInProgress(current)) {
        markAsDone(current);
        if (i + 1 < updatedStates.length) {
            markAsInProgress(updatedStates[i + 1]);
        }
        return true;
    } else {
        markAsInProgress(current);
    }
    return false;
};

const handleAfterIndex = (i, updatedStates) => {
    const current = updatedStates[i];
    if (shouldBeDelayed(current.status)) {
        markAsDelayed(current);
    } else {
        markAsNone(current);
    }
};

export function handleClick(index, states) {
    const updatedStates = states.map((s) => ({...s}));
    const length = updatedStates.length;

    if (isDelayed(updatedStates[index])) {

        for (let i = length - 1; i >= index; i--) {
            markAsNone(updatedStates[i]);
        }

    } else {

        for (let i = 0; i < length; i++) {
            if (isBeforeIndex(i, index)) {
                handleBeforeIndex(i, updatedStates);
            } else if (isAtIndex(i, index)) {
                const skipNext = handleCurrentIndex(i, updatedStates);
                if (skipNext) i++;
            } else if (isAfterIndex(i, index)) {
                handleAfterIndex(i, updatedStates);
            }
        }
    }

    return updatedStates;
}

export function setColor(status) {
    switch (status) {
        case "DONE":
            return "bg-green-500 text-white";
        case "DELAYED":
            return "bg-red-500 text-white";
        case "IN_PROGRESS":
            return "bg-blue-500 text-white";
        case "NONE":
            return "bg-neutral-300 text-black";
        default:
            return "bg-black text-white";
    }
};

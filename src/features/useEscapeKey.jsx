import { useEffect } from "react";

const useEscapeKey = (onEscape, enabled = true) => {
    useEffect(() => {
        if(!enabled) return;

        const handleKeyDown = (event) => {
            if(event.key === "Escape"){
                onEscape();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

    return() => {
        document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onEscape, enabled]);
};

export default useEscapeKey;
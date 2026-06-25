import { useEffect, useState } from "react";
import { UseDebouncedProps } from "./types";

export const useDebounced = ({ searchTerm, delay }: UseDebouncedProps): string => {
    const [debouncedValue, setDebouncedValue] = useState<string>(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchTerm);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, delay]);

    return debouncedValue;
};

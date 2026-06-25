import { LucideIcon } from "lucide-react";

export interface MenuItem {
    key: string;
    label: string;
    icon?: LucideIcon;
    link: string;
    children?: MenuItem[];
}

export type DecodedToken<T = any> = T;

export interface UseDebouncedProps {
    searchTerm: string;
    delay: number;
}

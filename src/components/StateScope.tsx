"use client";

import { Provider } from "jotai";

interface StateScopeProps {
    children: React.ReactNode;
}

export const StateScope = ({ children }: StateScopeProps) => {
    return <Provider>{children}</Provider>;
};
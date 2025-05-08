import { atom, useAtom } from "jotai";

const workspaceModalState = atom(false);

export const workspaceModal = () => {
    return useAtom(workspaceModalState);
};
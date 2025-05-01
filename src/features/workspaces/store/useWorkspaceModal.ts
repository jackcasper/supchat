import { atom, useAtom } from "jotai";

const workspaceModalState = atom(false);

export const useWorkspaceModal = () => {
    return useAtom(workspaceModalState);
};
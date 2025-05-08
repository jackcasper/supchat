import { atom, useAtom } from "jotai";

const channelModalState = atom(false);

export const channelModal = () => {
    return useAtom(channelModalState);
};
import { atom, useAtom } from "jotai";

const channelModalState = atom(false);

export const useChannelModal = () => {
    return useAtom(channelModalState);
};
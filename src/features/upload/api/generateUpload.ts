import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";

type ResponseType = string | null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
};

export const useGenerateUpload = () => {
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<"success" | "error" | "pending" | "settled" | null>(null);

    const isPending = useMemo(() => status === "pending", [status]);
    const isSuccess = useMemo(() => status === "success", [status]);
    const isSettled = useMemo(() => status === "settled", [status]);
    const isError = useMemo(() => status === "error", [status]);

    const mutation = useMutation(api.upload.generateUploadUrl);

    const mutate = useCallback(async (options?: Options) => {
        try {
            setData(null);
            setError(null);
            setStatus("pending");

            const response = await mutation();
            options?.onSuccess?.(response);
            return response;
        } catch (error) {
            setStatus("error");
            options?.onError?.(error as Error);
            if (options?.throwError) {
                throw error;
            }
        } finally {
            setStatus("settled");
            options?.onSettled?.();
        }
    }, [mutation]);

    return {
        mutate,
        data,
        error,
        isPending,
        isSettled,
        isSuccess,
        isError,
    };
};
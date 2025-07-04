import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, MutableRefObject, useLayoutEffect, useState } from "react";
import { Button } from "./ui/button";
import { ALargeSmall, FileImage, Send, SmilePlus, X } from "lucide-react";
import { FloatNote } from "./FloatNote";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import { EmojiInsert } from "./emojiInsert";
import Image from "next/image";

type EditorValue = {
    image: File | null;
    body: string;
};

interface EditorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update"
};

const Editor = ({
    onCancel,
    onSubmit,
    placeholder = "Message...",
    defaultValue = [],
    disabled = false,
    innerRef,
    variant = "create"
}: EditorProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);
    const imageElementRef = useRef<HTMLInputElement>(null);

    const [text, setText] = useState("");
    const [toolbarVisible, setToolbarVisible] = useState(true);
    const [image, setImage] = useState<File | null>(null);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    const handleSubmit = () => {
        const quill = quillRef.current;
        const addedImage = imageElementRef.current?.files?.[0] || null;

        const isEmpty = !addedImage && quill?.getText().replace(/<(.|\n)*?>/g, "").trim().length === 0;
        if (!quill || isEmpty) return;

        const body = JSON.stringify(quill.getContents());
        submitRef.current?.({ body, image: addedImage });
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }]
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                handleSubmit();
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            }
                        }
                    }
                },
            },
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = "";
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const toggleToolbar = () => {
        setToolbarVisible((current) => !current);
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden");
        }
    };

    const onEmojiSelect = (emojiValue: string) => {
        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0, emojiValue);
    };

    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").length === 0;

    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="image/*"
                ref={imageElementRef}
                onChange={(event) => setImage(event.target.files![0])}
                className="hidden"
            />
            <div className={cn(
                "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
                disabled && "opacity-50"
            )}>
                <div ref={containerRef} className="h-full ql-custom" />
                {!!image && (
                    <div className="p-2">
                        <div className="relative size-[62px] flex items-center justify-center group/image">
                            <FloatNote label="Remove image">
                                <button
                                    onClick={() => {
                                        setImage(null);
                                        imageElementRef.current!.value = "";
                                    }}
                                    className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </FloatNote>
                            <Image
                                src={URL.createObjectURL(image)}
                                alt="Uploded"
                                fill
                                className="rounded-xl overflow-hidden border object-cover"
                            />
                        </div>
                    </div>
                )}
                <div className="flex px-2 pb-2 z-[5]">
                    <FloatNote label={toolbarVisible ? "Hide formatting" : "Show formatting"}>
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                            onClick={toggleToolbar}
                        >
                            <ALargeSmall className="size-4" />
                        </Button>
                    </FloatNote>
                    <EmojiInsert onEmojiSelect={onEmojiSelect}>
                            <Button
                                disabled={disabled}
                                size="iconSm"
                                variant="ghost"
                            >
                                <SmilePlus className="size-4" />
                            </Button>
                    </EmojiInsert>
                    {variant === "create" && (
                        <FloatNote label="Image">
                            <Button
                                disabled={disabled}
                                size="iconSm"
                                variant="ghost"
                                onClick={() => imageElementRef.current?.click()}
                            >
                                <FileImage className="size-4" />
                            </Button>
                        </FloatNote>
                    )}
                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCancel}
                                disabled={disabled}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={disabled || isEmpty}
                                size="sm"
                                onClick={handleSubmit}
                                className="bg-[#1c2c7a] hover:bg-[#0000b3] text-white"
                            >
                                Save
                            </Button>
                        </div>
                    )}
                    {variant === "create" && (
                        <FloatNote label="Send">
                            <Button
                                disabled={disabled || isEmpty}
                                onClick={handleSubmit}
                                size="iconSm"
                                className={cn(
                                    "ml-auto",
                                    isEmpty
                                        ? "bg-white hover:bg-white text-muted-foreground"
                                        : "bg-[#1c2c7a] hover:bg-[#0000b3] text-white"
                                )}
                            >
                                <Send className="size-4" />
                            </Button>
                        </FloatNote>
                    )}
                </div>
            </div>
            {variant === "create" && (
                <div className={cn(
                    "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                    !isEmpty && "opacity-100"
                )}>
                    <p>
                        <strong>Shift + Enter</strong> to add a new line
                    </p>
                </div>
            )}
        </div>
    );
};

export default Editor;
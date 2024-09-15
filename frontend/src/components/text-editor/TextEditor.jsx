import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Toolbar from "./Toolbar";
import "./TextEditor.scss";

const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
    }),
    Highlight,
    TaskList,
    TaskItem,
    Underline,
    Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
    }),
    Image,
];

const content = "<p>Hello World!</p>";

const TextEditor = () => {
    const editor = useEditor({
        extensions,
        content,
    });

    return (
        <div className="border-2 border-teal-500 bg-white dark:bg-transparent text-[#0d0d0d] dark:text-teal-50 flex flex-col rounded-md">
            <Toolbar editor={editor} />
            <EditorContent editor={editor}></EditorContent>
        </div>
    );
};

export default TextEditor;

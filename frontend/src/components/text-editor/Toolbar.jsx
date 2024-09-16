import ToolbarItem from "./ToolbarItem";
import { Fragment } from "react";

const Toolbar = ({ editor }) => {
    const firstItems = [
        {
            icon: "bold",
            title: "Bold",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleBold().run();
            },
            isActive: () => editor.isActive("bold"),
        },
        {
            icon: "italic",
            title: "Italic",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
            },
            isActive: () => editor.isActive("italic"),
        },
        {
            icon: "underline",
            title: "Underline",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleUnderline().run();
            },
            isActive: () => editor.isActive("underline"),
        },
        {
            icon: "strikethrough",
            title: "Strike",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleStrike().run();
            },
            isActive: () => editor.isActive("strike"),
        },
        {
            icon: "code-view",
            title: "Code",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleCode().run();
            },
            isActive: () => editor.isActive("code"),
        },
        {
            icon: "mark-pen-line",
            title: "Highlight",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleHighlight().run();
            },
            isActive: () => editor.isActive("highlight"),
        },
        {
            type: "divider",
        },
        {
            icon: "h-1",
            title: "Heading 1",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeading({ level: 1 }).run();
            },
            isActive: () => editor.isActive("heading", { level: 1 }),
        },
        {
            icon: "h-2",
            title: "Heading 2",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeading({ level: 2 }).run();
            },
            isActive: () => editor.isActive("heading", { level: 2 }),
        },
        {
            icon: "h-3",
            title: "Heading 3",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeading({ level: 3 }).run();
            },
            isActive: () => editor.isActive("heading", { level: 3 }),
        },
        {
            icon: "paragraph",
            title: "Paragraph",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().setParagraph().run();
            },
            isActive: () => editor.isActive("paragraph"),
        },
        {
            icon: "list-unordered",
            title: "Bullet List",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleBulletList().run();
            },
            isActive: () => editor.isActive("bulletList"),
        },
        {
            icon: "list-ordered",
            title: "Ordered List",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleOrderedList().run();
            },
            isActive: () => editor.isActive("orderedList"),
        },
        {
            icon: "list-check-2",
            title: "Task List",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleTaskList().run();
            },
            isActive: () => editor.isActive("taskList"),
        },
        {
            icon: "code-box-line",
            title: "Code Block",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleCodeBlock().run();
            },
            isActive: () => editor.isActive("codeBlock"),
        },
        {
            type: "divider",
        },
        {
            icon: "double-quotes-l",
            title: "Blockquote",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().toggleBlockquote().run();
            },
            isActive: () => editor.isActive("blockquote"),
        },
        {
            icon: "separator",
            title: "Horizontal Rule",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().setHorizontalRule().run();
            },
        },
        {
            type: "divider",
        },
        {
            icon: "text-wrap",
            title: "Hard Break",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().setHardBreak().run();
            },
        },
        {
            icon: "format-clear",
            title: "Clear Format",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().clearNodes().unsetAllMarks().run();
            },
        },
        {
            type: "divider",
        },
        {
            icon: "arrow-go-back-line",
            title: "Undo",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().undo().run();
            },
            isDisabled: !editor.can().chain().focus().undo().run(),
        },
        {
            icon: "arrow-go-forward-line",
            title: "Redo",
            action: (e) => {
                e.preventDefault();
                editor.chain().focus().redo().run();
            },
            isDisabled: !editor.can().chain().focus().redo().run(),
        },
    ];
    const secondItems = [
        {
            icon: "link",
            title: "Link",
            action: (e) => {
                e.preventDefault();

                const previousUrl = editor.getAttributes("link").href;
                if (previousUrl) {
                    editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .unsetLink()
                        .run();
                    return;
                }

                const url = window.prompt("URL", previousUrl);
                if (!url) return;

                editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: url })
                    .run();
            },
            isActive: () => editor.isActive("link"),
        },
        {
            icon: "image-line",
            title: "Image",
            action: (e) => {
                e.preventDefault();

                const url = window.prompt("URL");

                if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            },
            isActive: () => editor.isActive("link"),
        },
    ];
    return (
        <div className="flex flex-wrap flex-[0_0_auto] items-center bg-teal-500 p-1">
            {firstItems.map((item, index) => (
                <Fragment key={index}>
                    {item.type === "divider" ? (
                        <div className="bg-[rgba(255,255,255,0.25)] ml-2 mr-3 w-px h-5" />
                    ) : (
                        <ToolbarItem {...item} />
                    )}
                </Fragment>
            ))}
            {secondItems.map((item, index) => (
                <Fragment key={index}>
                    {item.type === "divider" ? (
                        <div className="bg-[rgba(255,255,255,0.25)] ml-2 mr-3 w-px h-5" />
                    ) : (
                        <ToolbarItem {...item} />
                    )}
                </Fragment>
            ))}
        </div>
    );
};

export default Toolbar;

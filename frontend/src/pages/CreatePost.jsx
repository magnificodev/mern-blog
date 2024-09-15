import { TextInput, Select, FileInput, Button } from "flowbite-react";
import TextEditor from "../components/text-editor/TextEditor";

const CreatePost = () => {
    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Create Post
            </h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="flex-1"
                        required
                    />
                    <Select id="categories">
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">Javascript</option>
                        <option value="reactjs">ReactJS</option>
                        <option value="nextjs">NextJS</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-dotted border-teal-500 p-4 text-">
                    <FileInput id="file" accept="image/*" className="flex-1" />
                    <Button
                        type="button"
                        gradientDuoTone="purpleToPink"
                        size="sm"
                        outline
                    >
                        Upload image
                    </Button>
                </div>
                <TextEditor />
                <Button type="submit" gradientDuoTone="purpleToPink">
                    Publish
                </Button>
            </form>
        </div>
    );
};

export default CreatePost;

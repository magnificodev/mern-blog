import { Textarea, Button } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createComment } from "../api/comments";
import { Spinner, Alert } from "flowbite-react";

function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [remainingCharacters, setRemainingCharacters] = useState(300);
    const [comment, setComment] = useState("");

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            setComment("");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate({ comment, postId, userId: currentUser._id });
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Sign in as:</p>
                    <img
                        className="w-5 h-5 rounded-full object-cover"
                        src={currentUser.profilePic}
                        alt="Avatar"
                    />
                    <Link
                        to="/dashboard?tab=profile"
                        className="text-xs text-cyan-600 hover:underline"
                    >
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className="text-sm text-teal-500 my-5 flex items-center gap-1">
                    You must be logged in to comment.
                    <Link
                        to="/sign-in"
                        className="text-blue-500 hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            )}
            {currentUser && (
                <form
                    className="flex flex-col items-center gap-4 p-3 border border-teal-500 rounded-lg"
                    onSubmit={handleSubmit}
                >
                    <Textarea
                        id="comment"
                        placeholder="Add a comment..."
                        rows={3}
                        value={comment}
                        maxLength={300}
                        onChange={(e) => {
                            setRemainingCharacters(300 - e.target.value.length);
                            setComment(e.target.value);
                        }}
                    />
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-gray-400">
                            {remainingCharacters === 1
                                ? "1 character remaining"
                                : `${remainingCharacters} characters remaining`}
                        </p>
                        <Button
                            type="submit"
                            gradientDuoTone="purpleToBlue"
                            outline
                            disabled={!comment || isPending}
                        >
                            {isPending ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </form>
            )}
            {isError && <Alert color="failure">Error: {error.message}</Alert>}
        </div>
    );
}

export default CommentSection;

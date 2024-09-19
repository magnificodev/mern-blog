import { Textarea, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getPostComments } from "../api/comments";
import { Spinner, Alert } from "flowbite-react";
import Comment from "./Comment";

function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [remainingCharacters, setRemainingCharacters] = useState(300);
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError: isQueryError,
        error: queryError,
    } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => getPostComments(postId),
        refetchInterval: 3000, // Refetch every 3 seconds
    });

    const {
        mutate,
        isPending,
        isError: isMutationError,
        error: mutationError,
    } = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            setComment("");
            setRemainingCharacters(300);
            queryClient.invalidateQueries(["comments", postId]);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentUser && comment.trim()) {
            mutate({ content: comment, postId, userId: currentUser._id });
        }
    };

    if (isLoading) return <Spinner />;
    if (isQueryError)
        return (
            <Alert color="failure">
                Error loading comments: {queryError.message}
            </Alert>
        );

    const comments = data?.data.comments || [];

    return (
        <div className="max-w-2xl mx-auto w-full">
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as:</p>
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
                            disabled={!comment.trim() || isPending}
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
                    {isMutationError && (
                        <Alert color="failure">
                            Error submitting comment: {mutationError.message}
                        </Alert>
                    )}
                </form>
            )}
            {comments.length > 0 ? (
                <>
                    <div className="text-sm my-5 flex items-center gap-1">
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-3 rounded-sm">
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                    ))}
                </>
            ) : (
                <p className="text-sm my-5">No comments yet!</p>
            )}
        </div>
    );
}

export default CommentSection;

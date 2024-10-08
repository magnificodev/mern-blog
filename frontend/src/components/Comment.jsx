import { useState } from "react";

import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import { Modal, Textarea } from "flowbite-react";

import { FaThumbsUp, FaUserShield } from "react-icons/fa";
import { GiSprout } from "react-icons/gi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getUser } from "../api/users";
import { deleteComment, editComment, likeComment } from "../api/comments";

const Comment = ({ comment }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [likes, setLikes] = useState(comment.likes);
    const [numberOfLikes, setNumberOfLikes] = useState(comment.numberOfLikes);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: user } = useQuery({
        queryKey: ["user", comment.userId],
        queryFn: () => getUser(comment.userId),
        select: (data) => data.data.user,
    });

    const { mutate: likeCommentMutate } = useMutation({
        mutationFn: likeComment,
        onSuccess: (data) => {
            setLikes(data.data.comment.likes);
            setNumberOfLikes(data.data.comment.numberOfLikes);
            queryClient.invalidateQueries({
                queryKey: ["comments", comment.postId],
            });
        },
    });

    const { mutate: deleteCommentMutate, isPending: isDeleting } = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            setShowModal(false);
            queryClient.invalidateQueries({
                queryKey: ["comments", comment.postId],
            });
        },
    });

    const { mutate: editCommentMutate, isPending: isEditing } = useMutation({
        mutationFn: editComment,
        onSuccess: () => {
            setIsEdit(false);
            queryClient.invalidateQueries({
                queryKey: ["comments", comment.postId],
            });
        },
    });

    return (
        <div className="flex gap-3 items-start border-b border-gray-600 p-4">
            <div className="flex items-center gap-2">
                <img
                    src={user?.profilePic}
                    alt="Comment Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-1">
                    {user?.isAdmin ? (
                        <p className="text-xs font-medium text-red-700 flex items-center gap-1">
                            @{user?.username}
                            <FaUserShield className="w-3 h-3" title="Admin" />
                        </p>
                    ) : new Date().getDate() - new Date(user?.createdAt).getDate() < 3 ? (
                        <p className="text-xs font-medium text-green-500 flex items-center gap-1">
                            @{user?.username}
                            <GiSprout className="w-3 h-3" title="New User" />
                        </p>
                    ) : (
                        <p className="text-xs font-medium">@{user?.username}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        {moment(comment.createdAt).fromNow()}
                    </p>
                </div>

                {isEdit ? (
                    <div className="flex flex-col gap-2 items-end">
                        <Textarea
                            rows={2}
                            maxLength={300}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button
                                gradientDuoTone="purpleToBlue"
                                size="sm"
                                onClick={() =>
                                    editCommentMutate({
                                        commentId: comment._id,
                                        content: editedContent,
                                    })
                                }
                                disabled={isEditing}
                            >
                                {isEditing ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className="ml-2">Saving...</span>
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                            <Button
                                gradientDuoTone="purpleToBlue"
                                size="sm"
                                outline
                                onClick={() => setIsEdit(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm dark:text-gray-300">
                            {comment.content}
                        </p>
                        <div className="flex justify-start max-w-fit border-t border-gray-600 pt-2 gap-2 items-center text-xs text-gray-400">
                            <button
                                className={`${
                                    likes.includes(currentUser?._id)
                                        ? "text-blue-500"
                                        : ""
                                } hover:text-blue-500`}
                                onClick={() => {
                                    if (!currentUser) {
                                        navigate("/sign-in");
                                        return;
                                    }
                                    likeCommentMutate({
                                        commentId: comment._id,
                                        userId: currentUser?._id,
                                    });
                                }}
                            >
                                <FaThumbsUp className="w-4 h-4" />
                            </button>
                            {numberOfLikes > 0 && (
                                <p>
                                    {numberOfLikes > 1
                                        ? `${numberOfLikes} likes`
                                        : `${numberOfLikes} like`}
                                </p>
                            )}
                            {(currentUser?._id === user?._id ||
                                currentUser?.isAdmin) && (
                                <>
                                    {currentUser?._id === user?._id && (
                                        <button
                                            className="hover:text-blue-500"
                                            onClick={() => setIsEdit(true)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className="hover:text-red-500"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
            {showModal && (
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    popup
                    size="md"
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this comment?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button
                                    color="failure"
                                    onClick={() =>
                                        deleteCommentMutate(comment._id)
                                    }
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Spinner size="sm" />
                                            <span className="ml-2">
                                                Deleting...
                                            </span>
                                        </>
                                    ) : (
                                        "Yes, I'm sure"
                                    )}
                                </Button>
                                <Button
                                    color="gray"
                                    onClick={() => setShowModal(false)}
                                >
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default Comment;

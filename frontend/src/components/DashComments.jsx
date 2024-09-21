import { useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Button, Modal, Spinner, Table } from "flowbite-react";

import { FaCheck, FaTimes } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { deleteComment, getComments } from "../api/comments";
import { useAppContext } from "../contexts/AppContext";

const DashComments = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["comments"],
        queryFn: ({ pageParam }) => getComments({ skip: (pageParam - 1) * 5 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (
                lastPage.data.comments.length < 5 ||
                (lastPage.data.comments.length === 5 &&
                    pages.length * 5 === lastPage.data.totalComments)
            ) {
                return undefined;
            }
            return pages.length + 1;
        },
        refetchInterval: 10000,
    });

    const comments = data?.pages.flatMap((page) => page.data.comments) || [];

    const { mutate: deleteCommentMutate, isPending: isDeleting } = useMutation({
        mutationFn: deleteComment,
        onSuccess: (data) => {
            showToast({ type: data.status, message: data.message });
            queryClient.invalidateQueries(["comments"]);
            setShowModal(false);
        },
        onError: (err) => {
            showToast({ type: "failure", message: err.message });
        },
    });

    if (isLoading)
        return (
            <div className="flex items-center mx-auto">
                <Spinner size="xl" />
            </div>
        );
    if (isError) return <p>There is something wrong</p>;

    return (
        <div className="flex-1 p-3 overflow-hidden">
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <div className="w-full table-auto overflow-x-auto md:mx-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 shadow-md">
                        <Table hoverable striped>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Comment Content</Table.HeadCell>
                                <Table.HeadCell>Number of Likes</Table.HeadCell>
                                <Table.HeadCell>Post ID</Table.HeadCell>
                                <Table.HeadCell>User ID</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {comments.map((comment) => (
                                    <Table.Row key={comment._id}>
                                        <Table.Cell>
                                            {format(
                                                new Date(comment.updatedAt),
                                                "dd/MM/yyyy"
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.content}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="font-medium text-gray-900 dark:text-gray-300">
                                                {comment.likes.length}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="break-all">
                                            {comment.postId}
                                        </Table.Cell>
                                        <Table.Cell className="break-all">
                                            {comment.userId}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <button
                                                className="font-medium text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setCommentIdToDelete(
                                                        comment._id
                                                    );
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-full text-teal-500 self-center text-sm py-4 hover:underline"
                        >
                            {isFetchingNextPage
                                ? "Loading more..."
                                : "Show more"}
                        </button>
                    )}
                </>
            ) : (
                <p>No users found</p>
            )}
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
                                onClick={() => deleteCommentMutate(commentIdToDelete)}
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
        </div>
    );
}

export default DashComments;

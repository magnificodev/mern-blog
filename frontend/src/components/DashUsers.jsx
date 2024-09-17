import { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table, Spinner, Modal, Button } from "flowbite-react";
import { format } from "date-fns";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getUsers, deleteUser } from "../api/users";
function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const { data, fetchNextPage, hasNextPage, isLoading, isError } =
        useInfiniteQuery({
            queryKey: ["users"],
            queryFn: ({ pageParam = 1 }) => getUsers({ pageParam }),
            getNextPageParam: (lastPage, allPages) =>
                lastPage.data.totalPages > allPages.length
                    ? allPages.length + 1
                    : undefined,
        });

    const { mutate: deleteUserMutate, isLoading: isDeleting } = useMutation({
        mutationFn: (userId) => deleteUser(userId),
        onSuccess: () => {
            setShowModal(false);
            setUsers(users.filter((user) => user._id !== userIdToDelete));
            setUserIdToDelete("");
        },
    });

    const handleDeleteUser = () => {
        console.log(userIdToDelete);
        deleteUserMutate(userIdToDelete);
    };

    useEffect(() => {
        if (data) {
            const newUsers = data.pages.flatMap((page) => page.data.users);
            setUsers(newUsers);
        }
    }, [data]);

    if (isLoading) return <Spinner />;
    if (isError) return <p>There is something wrong</p>;

    return (
        <div className="flex-1 p-3 overflow-hidden">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <div className="w-full table-auto overflow-x-auto md:mx-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 shadow-md">
                        <Table hoverable striped>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>User Image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {users.map((user) => (
                                    <Table.Row key={user._id}>
                                        <Table.Cell>
                                            {format(
                                                new Date(user.createdAt),
                                                "dd/MM/yyyy"
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <img
                                                src={user.profilePic}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="font-medium text-gray-900 dark:text-gray-300">
                                                {user.username}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell>
                                            {user.isAdmin ? (
                                                <FaCheck className="text-green-500" />
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <button
                                                className="font-medium text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setUserIdToDelete(user._id);
                                                }}
                                                disabled={
                                                    user.isAdmin ||
                                                    user._id === currentUser._id
                                                }
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
                            className="w-full text-teal-500 self-center text-sm py-4 hover:underline"
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No users found</p>
            )}
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
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this user?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button
                                    color="failure"
                                    onClick={handleDeleteUser}
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
}

export default DashUsers;

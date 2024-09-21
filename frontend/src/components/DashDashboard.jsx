import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";
import { getComments } from "../api/comments";
import { getPosts } from "../api/posts";
import { Link } from "react-router-dom";
import { Button, Table } from "flowbite-react";
import {
    HiOutlineUserGroup,
    HiAnnotation,
    HiDocumentText,
    HiArrowNarrowUp,
} from "react-icons/hi";

const DashDashboard = () => {
    const { currentUser } = useSelector((state) => state.user);

    const { data: users, isLoading: isUsersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        staleTime: 0,
    });

    const { data: comments, isLoading: isCommentsLoading } = useQuery({
        queryKey: ["comments"],
        queryFn: getComments,
        staleTime: 0,
    });

    const { data: posts, isLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
        staleTime: 0,
    });

    return (
        <div className="p-3 md:mx-auto">
            <div className="flex-wrap flex gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Users
                            </h3>
                            <p className="text-2xl">{users?.data.totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex  gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {users?.data.lastMonthUsers}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Comments
                            </h3>
                            <p className="text-2xl">
                                {comments?.data.totalComments}
                            </p>
                        </div>
                        <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex  gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {comments?.data.lastMonthComments}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Posts
                            </h3>
                            <p className="text-2xl">{posts?.data.totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex  gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {posts?.data.lastMonthPosts}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
            </div>

            {/* Another */}

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between items-center p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent users</h1>
                        <a
                            href="/dashboard?tab=users"
                            className="text-green-500 hover:underline"
                        >
                            See all
                        </a>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {users?.data.users &&
                            users.data.users.map((user) => (
                                <Table.Body key={user._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img
                                                src={user.profilePic}
                                                alt="user"
                                                className="w-10 h-10 rounded-full bg-gray-500"
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between items-center p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent comments</h1>
                        <a
                            href="/dashboard?tab=comments"
                            className="text-green-500 hover:underline"
                        >
                            See all
                        </a>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {comments?.data.comments &&
                            comments.data.comments.map((comment) => (
                                <Table.Body
                                    key={comment._id}
                                    className="divide-y"
                                >
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="w-96">
                                            <p className="line-clamp-2">
                                                {comment.content}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.numberOfLikes}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between items-center p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent posts</h1>
                        <a
                            href="/dashboard?tab=posts"
                            className="text-green-500 hover:underline"
                        >
                            See all
                        </a>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {posts?.data.posts &&
                            posts.data.posts.map((post) => (
                                <Table.Body key={post._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img
                                                src={post.image}
                                                alt="user"
                                                className="w-14 h-10 rounded-md bg-gray-500"
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="w-96">
                                            {post.title}
                                        </Table.Cell>
                                        <Table.Cell className="w-5">
                                            {post.category}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default DashDashboard;

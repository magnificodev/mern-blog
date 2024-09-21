import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    return (
        <div className="group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
            <Link to={`/posts/${post.slug}`}>
                <img
                    src={post.image}
                    alt={post.title}
                    className="h-[250px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20 scale-110 group-hover:scale-100"
                />
            </Link>
            <div className="flex flex-col gap-2 p-3">
                <p
                    className="text-lg font-semibold line-clamp-2 mt-3"
                    title={post.title}
                >
                    {post.title}
                </p>
                {post.category && post.category !== "uncategorized" && (
                    <span className="text-sm italic">{post.category}</span>
                )}
                <Link
                    to={`/post/${post.slug}`}
                    className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
                >
                    Read More
                </Link>
            </div>
        </div>
    );
}

export default PostCard;

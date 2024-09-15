import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default:
                "https://capherangxay.vn/wp-content/uploads/2017/06/wood-blog-placeholder.jpg",
        },
        category: {
            type: String,
            default: "uncategorized",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("post", postSchema);

export default Post;

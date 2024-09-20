export const getPostComments = async ({ postId, skip, limit, order }) => {
    try {
        const url = new URL(
            `/api/v1/posts/${postId}/comments`,
            window.location.origin
        );

        const params = {
            skip,
            limit,
            order,
        };

        Object.keys(params).forEach((key) => {
            if (!!params[key]) {
                url.searchParams.set(key, params[key]);
            }
        });

        const response = await fetch(url);
        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const createComment = async (commentData) => {
    try {
        const response = await fetch("/api/v1/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
        });

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const likeComment = async ({ commentId, userId }) => {
    try {
        const response = await fetch(`/api/v1/comments/${commentId}/likes`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ commentId, userId }),
        });

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const editComment = async ({ commentId, content }) => {
    try {
        const response = await fetch(`/api/v1/comments/${commentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const deleteComment = async (commentId) => {
    try {
        const response = await fetch(`/api/v1/comments/${commentId}`, {
            method: "DELETE",
        });

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

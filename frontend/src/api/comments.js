export const createComment = async ({ comment, postId, userId }) => {
    try {
        const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment, postId, userId }),
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

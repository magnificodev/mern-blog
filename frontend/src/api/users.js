export const getUsers = async ({ pageParam = 1, limit = 5 } = {}) => {
    try {
        const url = new URL("/api/v1/users", window.location.origin);
        if (pageParam !== undefined && limit !== null) {
            url.searchParams.append("skip", (pageParam - 1) * limit);
        }
        if (limit !== null) {
            url.searchParams.append("limit", limit);
        }

        const response = await fetch(url);

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        console.error("Error fetching users:", err);
        throw new Error("Failed to fetch users. Please try again later.");
    }
};

export const getUser = async ({ userId }) => {
    try {
        const response = await fetch(`/api/v1/users/${userId}`);
        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const updateUser = async ({ userId, userData }) => {
    try {
        const response = await fetch(`/api/v1/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
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

export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`/api/v1/users/${userId}`, {
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

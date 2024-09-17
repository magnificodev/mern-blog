export const getUsers = async ({ pageParam = 1, limit = 5 } = {}) => {
    try {
        const url = new URL("/api/users", window.location.origin);
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

export const updateUser = async (userData) => {
    try {
        console.log(userData);
        const response = await fetch(`/api/users/${userData.userId}`, {
            method: "PUT",
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
        const response = await fetch(`/api/users/${userId}`, {
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

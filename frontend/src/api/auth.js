export const signUp = async (userData) => {
    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
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

export const signIn = async (userData) => {
    try {
        const response = await fetch("/api/auth/signin", {
            method: "POST",
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

export const googleAuth = async (userData) => {
    try {
        const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const responseBody = await response.json();
        console.log(responseBody);
        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

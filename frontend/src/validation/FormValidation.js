export const usernameValidationObj = {
    required: "This field is required",
    minLength: {
        value: 4,
        message: "Username must be at least 4 characters",
    },
    pattern: {
        value: /^[A-Za-z0-9_]+$/,
        message: "Username can only include letters, numbers, and underscores",
    },
};

export const emailValidationObj = {
    required: "This field is required",
    pattern: {
        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: "Please enter a valid email",
    },
};

export const passwordValidationObj = {
    required: "This field is required",
    minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
    },
};

export class MyError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = "failure";
    }
}

// let errorMessage;
// if (err.name === "MongoServerError" && err.code === 11000) {
//     const fieldName = Object.keys(err.keyValue)[0];
//     errorMessage = `${fieldName.slice(0, 1).toUpperCase() + fieldName.slice(1)} already exists`;
// }
// if (err.name === "ValidationError") {
//     errorMessage = Object.values(err.errors)[0].message;
// }
// console.log(errorMessage);

import express from "express"
import "dotenv/config"

const PORT = process.env.PORT_NUMBER || 3000;

const app = express();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

export const testApi = (req, res) => {
    console.log(req.url, req.method);
    res.json({ message: "Test Api is working well" });
};

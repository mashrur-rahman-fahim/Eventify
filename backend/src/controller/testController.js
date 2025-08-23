const testController = (req, res) => {
    try {
        res.status(200).json({
            message: "Hello World",
        });
       
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default testController;
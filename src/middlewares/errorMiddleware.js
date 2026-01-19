// src/middlewares/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
    console.error("Error Middleware:", err);
  
    // Multer errors
    if (err.name === "MulterError") {
      return res.status(400).json({ msg: err.message });
    }
  
    // Custom errors
    if (err.message) {
      return res.status(500).json({ msg: err.message });
    }
  
    res.status(500).json({ msg: "Internal Server Error" });
  };
  
  export default errorMiddleware;
  
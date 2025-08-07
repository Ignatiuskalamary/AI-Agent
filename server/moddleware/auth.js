import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  console.log("Auth middleware triggered");
  const token = req.headers.authorization;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware passed");
    next();
    console.log("Next middleware called");
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default auth;

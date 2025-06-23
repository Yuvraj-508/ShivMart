import jwt from 'jsonwebtoken';
const authUser= (req, res, next) => {
    const {token }= req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
        }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
 
}

export default authUser;
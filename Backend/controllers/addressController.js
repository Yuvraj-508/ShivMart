import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const addressData = req.body; // Assuming you're sending the entire address object directly
        const { id: userId } = req.user;

        console.log("User ID:", userId, addressData);

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing." });
        }

        await Address.create({ ...addressData, userId }); // Correct: Pass userId as per schema

        res.status(201).json({ message: "Address added successfully", success: true });
    }
    catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


export const getAddress = async (req, res) => {
    try {
        const { id: userId } = req.user;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const addresses = await Address.find({ userId });

        res.status(200).json({
            message: "Addresses fetched successfully",
            success: true,
            addresses // ✅ match the key with frontend
        });
    } catch (error) {
        console.error("Error fetching address:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

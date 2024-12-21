const express = require("express");
const Service = require("./../models/service");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Add a new service (Admin only)
router.post("/services", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, provider } = req.body;

  try {
    console.log(req.user.id);
    const service = new Service({
      name,
      description,
      price,
      provider: req.user.id,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Remove a service (Admin only)
router.delete("/services/:id",authMiddleware,adminMiddleware,async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      await Service.findByIdAndDelete(req.params.id);
      res.json({ message: "Service removed" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.get("/services", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

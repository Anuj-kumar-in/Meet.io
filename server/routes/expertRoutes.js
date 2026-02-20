const express = require("express");
const { getExperts, getExpertById, getCategories } = require("../controllers/expertController");

const router = express.Router();

router.get("/", getExperts);
router.get("/categories", getCategories);
router.get("/:id", getExpertById);

module.exports = router;

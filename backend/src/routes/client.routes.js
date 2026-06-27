const router = require("express").Router()
const { getAll, getOne, create, update, remove } = require("../controllers/client.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.use(authMiddleware)

router.get("/", getAll)
router.get("/:id", getOne)
router.post("/", create)
router.put("/:id", update)
router.delete("/:id", remove)

module.exports = router
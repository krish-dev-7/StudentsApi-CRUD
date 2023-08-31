const { Router } = require("express");
const ModToken = require("../../models/Token");
const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("./verifyRefToken");

const router = Router();

//refresh to get new access token
router.post("/", (req, res) => {
  if (!req.body.token) return res.sendStatus(403);
  verifyRefreshToken(req.body.token)
    .then(({ tokenDetails }) => {
      const payload = { modId: tokenDetails.modId };
      const accessToken = jwt.sign(payload, process.env.ATK, {
        expiresIn: "14m",
      });
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
});

// logout
router.delete("/", async (req, res) => {
  try {
    if (!req.body.token) return res.sendStatus(403);
    const modToken = await ModToken.findOne({ token: req.body.token });
    if (!modToken)
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Sucessfully" });

    await modToken.remove();
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;

const { Router } = require("express");
const { v4: uuid4 } = require("uuid");
const bcrypt = require("bcrypt");
const generateToken = require("./tokenManager/generateToken").default;
const Mod = require("../models/mods");

const router = Router();

router.post("/mod/register", async (req, res) => {
  const modId = uuid4();
  const salt = await bcrypt.genSalt(10);
  const password = req.body.password;
  const hashedPass = await bcrypt.hash(password, salt);
  const mod = new Mod({
    modId: modId,
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  });
  await mod
    .save()
    .then((result) => {
      res.json({ success: true, mod: mod });
    })
    .catch((err) => {
      if (err && err.code === 11000) {
        res.json({
          success: false,
          message: "User already exists, try with another email",
        });
      } else {
        res.json({ success: false, message: "can't register" });
      }
    });
});

router.post("/mod/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const mod = await Mod.findOne({ email: email });
  if (mod) {
    console.log(mod.modId);
    const isValidPass = await bcrypt.compare(password, mod.password);
    if (isValidPass) {
      const { accessTok, refreshTok } = generateToken(mod.modId);
      res.json({
        success: true,
        message: "Login successfull",
        accessToken: accessTok,
        refreshToken: refreshTok,
        mod: mod,
      });
    } else {
      res.json({ success: false, message: "Wrong password" });
    }
  } else {
    res.json({
      success: false,
      message: "User does not exist, register in '/api/mod/register' endpoint",
    });
  }
});

module.exports = router;

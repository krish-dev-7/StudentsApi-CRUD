require("dotenv").config();
const express = require("express");
const { v4: uuid4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Model import
const Students = require("../models/student");
const Mod = require("../models/mods");

//routes import
const tokenRoutes = require("./tokenManager/tokenHandler");
const authRoute = require("./authServer");

//middleware import
const authTok = require("./middleware/auth");

//router initialization
const router = express.Router();
router.use("/", authRoute);
router.use("/refreshToken", tokenRoutes);

//url parsing
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.json({ success: true, message: "Api can be implemented" });
});

router.post("/addStudent", authTok, async (req, res) => {
  const stud = new Students({
    studId: uuid4(),
    name: req.body.name,
    dept: req.body.dept,
    year: req.body.year,
    regNo: req.body.regNo,
    modId: req.modId,
  });
  await stud
    .save()
    .then((result) => res.json({ success: true, student: stud }))
    .catch((err) => {
      if (err || err.code === 11000) {
        res.json({ success: false, message: "Already exist!" });
      } else {
        res.json({ success: false, message: err });
      }
    });
});

router.get("/students", async (req, res) => {
  console.log("check for change");
  res.json(await Students.find());
});

router.get("/studId/:studId", async (req, res) => {
  const stud = await Students.findOne({ studId: req.params.studId });
  if (stud) res.json(stud);
  else {
    res.json({ success: false, message: "Student Not Found" });
  }
});
router.delete("/studId/:studId/", authTok, async (req, res) => {
  await Students.remove({ studId: req.params.studId }, (err) => {
    if (err) {
      res.json({ success: false, error: err });
    } else {
      res.json({ success: true, message: req.params.studId + " Deleted" });
    }
  });
});
router.delete("/regNo/:regNo", authTok, async (req, res) => {
  await Students.remove({ regNo: req.params.regNo }, (err) => {
    if (err) {
      res.json({ success: false, error: err });
    } else {
      res.json({ success: true, message: req.params.regNo + " Deleted" });
    }
  });
});
router.get("/regNo/:regNo", async (req, res) => {
  const stud = await Students.findOne({ regNo: req.params.regNo });
  if (stud) res.json(stud);
  else {
    res.json({ success: false, message: "Student Not Found" });
  }
});

router.post("/regNo/update/:regNo", authTok, async (req, res) => {
  const update = {
    name: req.body.name,
    dept: req.body.dept,
    year: req.body.year,
  };
  const filter = {
    regNo: req.params.regNo,
  };
  await Students.findOneAndUpdate(filter, update).then(async () => {
    const stud = await Students.findOne(filter);
    if (stud) res.json({ success: true, stud: stud });
    else {
      res.json({ success: false, message: "Oops!, Can't Update" });
    }
  });
});

module.exports = router;

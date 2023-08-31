const jwt = require("jsonwebtoken");

async function basicAuth(req, res) {
  let auth = req.headers.authorization;
  if (!auth) {
    return false;
  }
  const encoded = auth.substring(6);
  const [email, pass] = Buffer.from(encoded, "base64")
    .toString("ascii")
    .split(":");
  const mod = await Mod.findOne({ email: email });
  if (mod) {
    console.log(mod.name);
    const isValidPass = await bcrypt.compare(pass, mod.password);
    if (!isValidPass) {
      return false;
    }
    return true;
  } else return false;
}

const authTok = async (req, res, next) => {
  const token = req.header("x-access-token");
  if (!token)
    return res
      .status(403)
      .json({ error: true, message: "Access Denied, No token provided" });

  try {
    const tokenDetails = jwt.verify(token, process.env.ATK);
    req.modId = tokenDetails.modId;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ error: true, message: "Access Denied: Invalid token" });
  }
};

module.exports = authTok;

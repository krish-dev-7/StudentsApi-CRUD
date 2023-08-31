import ModToken from "../../models/Token";
import { sign } from "jsonwebtoken";

async function generateToken(id) {
  try {
    const payload = { modId: id };
    const accessTok = sign(payload, process.env.ATK, { expiresIn: "14m" });
    const refreshTok = sign(payload, process.env.RTK, { expiresIn: "30d" });
    console.log("acess = " + accessTok);
    // const modToken = await ModToken.find({ modId: id }).limit(1);
    // if (modToken) await modToken.remove();

    await new ModToken({
      modId: id,
      token: refreshTok,
    }).save();
    return Promise.resolve({ accessTok, refreshTok });
  } catch (error) {
    return Promise.reject(error);
  }
}

export default generateToken;

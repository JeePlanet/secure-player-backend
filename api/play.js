import crypto from "crypto";

const SECRET = "MY_SUPER_SECRET_KEY_123";

function encrypt(text) {
  const cipher = crypto.createCipher("aes-128-cbc", SECRET);
  let enc = cipher.update(text, "utf8", "hex");
  enc += cipher.final("hex");
  return enc;
}

function decrypt(text) {
  const decipher = crypto.createDecipher("aes-128-cbc", SECRET);
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

export default function handler(req, res) {
  const { id, url } = req.query;

  // 🔐 Encrypt mode (TEMP)
  if (url) {
    const encrypted = encrypt(url);
    return res.send(encrypted);
  }

  // ▶ Play mode
  if (!id) return res.status(400).send("Missing ID");

  try {
    const realUrl = decrypt(id);
    return res.redirect(realUrl);
  } catch {
    return res.status(403).send("Invalid or expired link");
  }
}

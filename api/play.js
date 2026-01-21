import crypto from "crypto";

const SECRET = "MY_SUPER_SECRET_KEY_123"; // change later

function decrypt(text) {
  const decipher = crypto.createDecipher("aes-128-cbc", SECRET);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export default function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send("Missing ID");
    }

    const realUrl = decrypt(id);

    // Basic validation
    if (!realUrl.startsWith("https://")) {
      return res.status(403).send("Invalid link");
    }

    // Redirect to real content
    res.redirect(realUrl);

  } catch (err) {
    return res.status(403).send("Invalid or expired link");
  }
}

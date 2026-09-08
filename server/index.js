require("dotenv").config();
const express = require("express");
const cors = require("cors");

const {
  XENDIT_SECRET_KEY,
  XENDIT_CALLBACK_VERIFICATION_TOKEN,
  PORT = 4000,
  CLIENT_ORIGIN = "http://localhost:3000",
} = process.env;

if (!XENDIT_SECRET_KEY) {
  console.warn(
    "[gearhub-server] XENDIT_SECRET_KEY is not set. Invoice creation will fail until it is.",
  );
}

const XENDIT_INVOICES_URL = "https://api.xendit.co/v2/invoices";

function authHeader() {
  return `Basic ${Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")}`;
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.post("/api/invoices", async (req, res) => {
  try {
    const { lineItems, referenceNumber, paymentMethods } = req.body || {};

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ error: "lineItems is required" });
    }
    if (!referenceNumber) {
      return res.status(400).json({ error: "referenceNumber is required" });
    }
    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      return res.status(400).json({ error: "paymentMethods is required" });
    }

    const amount = lineItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const response = await fetch(XENDIT_INVOICES_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: referenceNumber,
        amount,
        currency: "PHP",
        payment_methods: paymentMethods,
        items: lineItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.unitPrice,
          category: "GEARHUB",
        })),
        success_redirect_url: `${CLIENT_ORIGIN}/?xendit=return`,
        failure_redirect_url: `${CLIENT_ORIGIN}/?xendit=return`,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      console.error("[gearhub-server] Xendit error:", json);
      return res.status(response.status).json({
        error: json?.message || json?.error_code || "Xendit request failed",
      });
    }

    res.json({ id: json.id, invoiceUrl: json.invoice_url });
  } catch (err) {
    console.error("[gearhub-server] Failed to create invoice:", err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

app.get("/api/invoices/:id", async (req, res) => {
  try {
    const response = await fetch(`${XENDIT_INVOICES_URL}/${req.params.id}`, {
      headers: { Authorization: authHeader() },
    });
    const json = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: json?.message || json?.error_code || "Xendit request failed",
      });
    }

    res.json({ status: json.status });
  } catch (err) {
    console.error("[gearhub-server] Failed to retrieve invoice:", err);
    res.status(500).json({ error: "Failed to retrieve invoice" });
  }
});

app.post("/webhooks/xendit", (req, res) => {
  try {
    if (XENDIT_CALLBACK_VERIFICATION_TOKEN) {
      const providedToken = req.headers["x-callback-token"];
      if (providedToken !== XENDIT_CALLBACK_VERIFICATION_TOKEN) {
        console.warn("[gearhub-server] Rejected webhook: token mismatch");
        return res.sendStatus(401);
      }
    }

    console.log(
      "[gearhub-server] Xendit webhook received:",
      req.body?.status,
      req.body?.external_id,
    );
  } catch (err) {
    console.error("[gearhub-server] Failed to process webhook:", err);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`[gearhub-server] listening on http://localhost:${PORT}`);
});
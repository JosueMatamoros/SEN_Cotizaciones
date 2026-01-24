import "dotenv/config";
import express from "express";
import proformaRoutes from "./routes/proforma.routes.js";

const app = express();

app.use(express.json({ limit: "2mb" }));

app.use("/proformas", proformaRoutes);

app.use((err, req, res, next) => {
  const status = err?.status || 500;
  res.status(status).json({
    ok: false,
    error: err?.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});

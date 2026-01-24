import { createProformaSchema } from "../schemas/proforma.schema.js";
import { createProforma as createProformaDB } from "../models/proforma.model.js";

export async function createProforma(req, res, next) {
  try {
    const parsed = createProformaSchema.safeParse(req.body);

    if (!parsed.success) {
      const error = new Error("Datos inválidos");
      error.status = 400;
      error.details = parsed.error.format();
      throw error;
    }

    const proforma = await createProformaDB(parsed.data);

    res.status(201).json({
      ok: true,
      data: proforma,
    });
  } catch (err) {
    next(err);
  }
}

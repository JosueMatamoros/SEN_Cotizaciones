import { z } from "zod";

const itemSchema = z.object({
  type: z.enum(["PRODUCT", "SERVICE"]),
  description: z.string().min(1),
  unit_price: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

export const createProformaSchema = z.object({
  party_type: z.enum(["CLIENT", "COMPANY"]),
  party_name: z.string().min(1),

  party_phone: z.string().nullable().optional(),
  party_email: z.string().email().nullable().optional(),
  party_location: z.string().nullable().optional(),

  advisor_name: z.string().nullable().optional(),
  advisor_phone: z.string().nullable().optional(),

  notes: z.string().nullable().optional(),
  annex: z.string().nullable().optional(),

  items: z.array(itemSchema).min(1),
});

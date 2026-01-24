import { pool } from "../db.js";

export async function createProforma(data) {
  const query = `
    insert into proforma (
      party_type,
      party_name,
      party_phone,
      party_email,
      party_location,
      advisor_name,
      advisor_phone,
      notes,
      annex,
      items
    )
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb)
    returning *
  `;

  const values = [
    data.party_type,
    data.party_name,
    data.party_phone ?? null,
    data.party_email ?? null,
    data.party_location ?? null,
    data.advisor_name ?? null,
    data.advisor_phone ?? null,
    data.notes ?? null,
    data.annex ?? null,
    JSON.stringify(data.items),
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

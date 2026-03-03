import type { TriggerField } from "./types";

export const TRIGGER_FIELDS: TriggerField[] = [
  { key: "first_name",   label: "First Name",   example: "John" },
  { key: "last_name",    label: "Last Name",     example: "Doe" },
  { key: "email",        label: "Email",         example: "john@acme.com" },
  { key: "company_name", label: "Company Name",  example: "Acme Corp" },
  { key: "phone",        label: "Phone",         example: "+44 20 1234 5678" },
  { key: "contact_id",   label: "Contact ID",    example: "346067938545" },
  { key: "deal_id",      label: "Deal ID",       example: "987654321" },
];

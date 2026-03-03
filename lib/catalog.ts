import type { ActionDef } from "./types";

export const ACTION_CATALOG: ActionDef[] = [
  // ─── CONTACTS ──────────────────────────────────────────────────────────────

  {
    id: "hubspot_create_contact",
    category: "Contacts",
    label: "Create Contact",
    description: "Creates a new contact. Returns existing if email already present.",
    icon: "UserPlus",
    api: { method: "POST", path: "/crm/v3/objects/contacts" },
    fields: [
      { key: "email",          label: "Email",          type: "email",  required: true },
      { key: "firstname",      label: "First Name",     type: "string", required: false },
      { key: "lastname",       label: "Last Name",      type: "string", required: false },
      { key: "phone",          label: "Phone",          type: "string", required: false },
      { key: "company",        label: "Company Name",   type: "string", required: false },
      { key: "jobtitle",       label: "Job Title",      type: "string", required: false },
      { key: "website",        label: "Website",        type: "string", required: false },
      {
        key: "lifecyclestage", label: "Lifecycle Stage", type: "enum", required: false,
        options: [
          { value: "subscriber",  label: "Subscriber" },
          { value: "lead",        label: "Lead" },
          { value: "marketingqualifiedlead", label: "Marketing Qualified Lead" },
          { value: "salesqualifiedlead",     label: "Sales Qualified Lead" },
          { value: "opportunity", label: "Opportunity" },
          { value: "customer",    label: "Customer" },
          { value: "evangelist",  label: "Evangelist" },
          { value: "other",       label: "Other" },
        ],
      },
      {
        key: "hs_lead_status", label: "Lead Status", type: "enum", required: false,
        options: [
          { value: "NEW",               label: "New" },
          { value: "OPEN",              label: "Open" },
          { value: "IN_PROGRESS",       label: "In Progress" },
          { value: "OPEN_DEAL",         label: "Open Deal" },
          { value: "UNQUALIFIED",       label: "Unqualified" },
          { value: "ATTEMPTED_TO_CONTACT", label: "Attempted to Contact" },
          { value: "CONNECTED",         label: "Connected" },
          { value: "BAD_TIMING",        label: "Bad Timing" },
        ],
      },
    ],
  },

  {
    id: "hubspot_update_contact",
    category: "Contacts",
    label: "Update Contact",
    description: "Updates an existing contact identified by Contact ID from the trigger.",
    icon: "UserPen",
    api: { method: "PATCH", path: "/crm/v3/objects/contacts/{contact_id}" },
    fields: [
      { key: "contact_id",    label: "Contact ID",     type: "string", required: true,  hint: "From trigger — identifies which contact to update" },
      { key: "firstname",     label: "First Name",     type: "string", required: false },
      { key: "lastname",      label: "Last Name",      type: "string", required: false },
      { key: "phone",         label: "Phone",          type: "string", required: false },
      { key: "jobtitle",      label: "Job Title",      type: "string", required: false },
      { key: "company",       label: "Company Name",   type: "string", required: false },
      {
        key: "lifecyclestage", label: "Lifecycle Stage", type: "enum", required: false,
        options: [
          { value: "subscriber",  label: "Subscriber" },
          { value: "lead",        label: "Lead" },
          { value: "marketingqualifiedlead", label: "Marketing Qualified Lead" },
          { value: "salesqualifiedlead",     label: "Sales Qualified Lead" },
          { value: "opportunity", label: "Opportunity" },
          { value: "customer",    label: "Customer" },
        ],
      },
      {
        key: "hs_lead_status", label: "Lead Status", type: "enum", required: false,
        options: [
          { value: "NEW",         label: "New" },
          { value: "OPEN",        label: "Open" },
          { value: "IN_PROGRESS", label: "In Progress" },
          { value: "UNQUALIFIED", label: "Unqualified" },
          { value: "CONNECTED",   label: "Connected" },
        ],
      },
    ],
  },

  {
    id: "hubspot_find_contact",
    category: "Contacts",
    label: "Find Contact",
    description: "Searches for a contact by email or name and returns matching records.",
    icon: "Search",
    api: { method: "POST", path: "/crm/v3/objects/contacts/search" },
    fields: [
      { key: "email",     label: "Email",      type: "email",  required: false },
      { key: "firstname", label: "First Name", type: "string", required: false },
      { key: "lastname",  label: "Last Name",  type: "string", required: false },
    ],
  },

  // ─── DEALS ─────────────────────────────────────────────────────────────────

  {
    id: "hubspot_create_deal",
    category: "Deals",
    label: "Create Deal",
    description: "Creates a new deal in the CRM pipeline.",
    icon: "Briefcase",
    api: { method: "POST", path: "/crm/v3/objects/deals" },
    fields: [
      { key: "dealname",  label: "Deal Name",   type: "string", required: true },
      {
        key: "dealstage", label: "Deal Stage", type: "enum", required: true,
        defaultValue: "2578099407",
        options: [
          { value: "2578099407",          label: "Prospects (unqualified)" },
          { value: "2578099408",          label: "Contacted" },
          { value: "appointmentscheduled", label: "Meeting booked" },
          { value: "qualifiedtobuy",      label: "Qualified To Buy" },
          { value: "presentationscheduled", label: "Demo scheduled" },
          { value: "decisionmakerboughtin", label: "Decision Maker Bought-In" },
          { value: "contractsent",        label: "Contract Sent" },
          { value: "closedwon",           label: "Closed Won" },
          { value: "closedlost",          label: "Closed Lost" },
          { value: "2709967040",          label: "Disqualified" },
        ],
      },
      { key: "amount",    label: "Amount (£)",  type: "number", required: false },
      { key: "closedate", label: "Close Date",  type: "date",   required: false },
      {
        key: "hs_priority", label: "Priority", type: "enum", required: false,
        options: [
          { value: "low",    label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high",   label: "High" },
        ],
      },
      { key: "description", label: "Description", type: "text", required: false },
    ],
  },

  {
    id: "hubspot_move_deal_stage",
    category: "Deals",
    label: "Move Deal to Stage",
    description: "Moves an existing deal to a different pipeline stage.",
    icon: "ArrowRightCircle",
    api: { method: "PATCH", path: "/crm/v3/objects/deals/{deal_id}" },
    fields: [
      { key: "deal_id",   label: "Deal ID",    type: "string", required: true, hint: "From trigger — identifies which deal to move" },
      {
        key: "dealstage", label: "New Stage",  type: "enum",   required: true,
        options: [
          { value: "2578099407",            label: "Prospects (unqualified)" },
          { value: "2578099408",            label: "Contacted" },
          { value: "appointmentscheduled",  label: "Meeting booked" },
          { value: "qualifiedtobuy",        label: "Qualified To Buy" },
          { value: "presentationscheduled", label: "Demo scheduled" },
          { value: "decisionmakerboughtin", label: "Decision Maker Bought-In" },
          { value: "contractsent",          label: "Contract Sent" },
          { value: "closedwon",             label: "Closed Won" },
          { value: "closedlost",            label: "Closed Lost" },
          { value: "2709967040",            label: "Disqualified" },
        ],
      },
    ],
  },

  {
    id: "hubspot_update_deal",
    category: "Deals",
    label: "Update Deal",
    description: "Updates properties of an existing deal identified by Deal ID from the trigger.",
    icon: "PenLine",
    api: { method: "PATCH", path: "/crm/v3/objects/deals/{deal_id}" },
    fields: [
      { key: "deal_id",     label: "Deal ID",      type: "string", required: true, hint: "From trigger — identifies which deal to update" },
      { key: "dealname",    label: "Deal Name",    type: "string", required: false },
      { key: "amount",      label: "Amount (£)",   type: "number", required: false },
      { key: "closedate",   label: "Close Date",   type: "date",   required: false },
      { key: "description", label: "Description",  type: "text",   required: false },
      {
        key: "hs_priority", label: "Priority", type: "enum", required: false,
        options: [
          { value: "low",    label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high",   label: "High" },
        ],
      },
    ],
  },

  {
    id: "hubspot_associate_contact_deal",
    category: "Deals",
    label: "Associate Contact with Deal",
    description: "Links an existing contact to an existing deal.",
    icon: "Link",
    api: { method: "PUT", path: "/crm/v3/objects/deals/{deal_id}/associations/contacts/{contact_id}/deal_to_contact" },
    fields: [
      { key: "deal_id",    label: "Deal ID",    type: "string", required: true, hint: "From trigger" },
      { key: "contact_id", label: "Contact ID", type: "string", required: true, hint: "From trigger" },
    ],
  },

  // ─── COMPANIES ─────────────────────────────────────────────────────────────

  {
    id: "hubspot_create_company",
    category: "Companies",
    label: "Create Company",
    description: "Creates a new company record in HubSpot.",
    icon: "Building2",
    api: { method: "POST", path: "/crm/v3/objects/companies" },
    fields: [
      { key: "name",              label: "Company Name",    type: "string", required: true },
      { key: "domain",            label: "Website Domain",  type: "string", required: false, hint: "e.g. acme.com" },
      { key: "phone",             label: "Phone",           type: "string", required: false },
      { key: "industry",          label: "Industry",        type: "string", required: false },
      { key: "city",              label: "City",            type: "string", required: false },
      { key: "country",           label: "Country",         type: "string", required: false },
      { key: "numberofemployees", label: "Employees",       type: "number", required: false },
      { key: "annualrevenue",     label: "Annual Revenue",  type: "number", required: false },
      { key: "description",       label: "Description",     type: "text",   required: false },
    ],
  },

  {
    id: "hubspot_update_company",
    category: "Companies",
    label: "Update Company",
    description: "Updates an existing company, looked up by domain or name.",
    icon: "Building2",
    api: { method: "PATCH", path: "/crm/v3/objects/companies/{companyId}" },
    fields: [
      { key: "domain",            label: "Domain (lookup)", type: "string", required: false, hint: "Preferred — used to find the company" },
      { key: "name",              label: "Company Name",    type: "string", required: false, hint: "Fallback if no domain" },
      { key: "phone",             label: "Phone",           type: "string", required: false },
      { key: "industry",          label: "Industry",        type: "string", required: false },
      { key: "numberofemployees", label: "Employees",       type: "number", required: false },
      { key: "annualrevenue",     label: "Annual Revenue",  type: "number", required: false },
      { key: "description",       label: "Description",     type: "text",   required: false },
    ],
  },

  {
    id: "hubspot_associate_contact_company",
    category: "Companies",
    label: "Associate Contact with Company",
    description: "Links an existing contact to an existing company.",
    icon: "Link",
    api: { method: "PUT", path: "/crm/v3/objects/contacts/{contact_id}/associations/companies/{companyId}/contact_to_company" },
    fields: [
      { key: "contact_id",   label: "Contact ID",     type: "string", required: true, hint: "From trigger" },
      { key: "company_domain", label: "Company Domain", type: "string", required: false, hint: "Used to look up the company" },
      { key: "company_name",   label: "Company Name",   type: "string", required: false, hint: "Fallback if no domain" },
    ],
  },
];

export const CATEGORIES = [...new Set(ACTION_CATALOG.map((a) => a.category))];

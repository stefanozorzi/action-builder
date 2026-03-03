export type FieldType = "string" | "email" | "number" | "date" | "text" | "enum";

export interface FieldOption {
  value: string;
  label: string;
}

export interface ActionField {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  hint?: string;
  options?: FieldOption[];
  defaultValue?: string;
}

export interface ActionDef {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: string;
  api: { method: string; path: string };
  fields: ActionField[];
}

export interface TriggerField {
  key: string;
  label: string;
  example: string;
}

export type MappingMode = "trigger" | "static";

export interface FieldMapping {
  mode: MappingMode;
  triggerField?: string;
  staticValue?: string;
}

export interface ActionConfig {
  actionId: string;
  fieldMappings: Record<string, FieldMapping>;
}

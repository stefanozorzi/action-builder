"use client";

import { useState, useEffect } from "react";
import { Zap, Type, ChevronDown, Info, Check } from "lucide-react";
import type { ActionDef, ActionField, ActionConfig, FieldMapping } from "@/lib/types";
import { TRIGGER_FIELDS } from "@/lib/trigger";

interface Props {
  action: ActionDef;
  onSave: (config: ActionConfig) => void;
  onBack: () => void;
}

function buildDefaults(action: ActionDef): Record<string, FieldMapping> {
  const defaults: Record<string, FieldMapping> = {};
  for (const field of action.fields) {
    // Auto-map fields whose key matches a trigger field key
    const triggerMatch = TRIGGER_FIELDS.find((t) => t.key === field.key);
    if (triggerMatch) {
      defaults[field.key] = { mode: "trigger", triggerField: triggerMatch.key };
    } else if (field.defaultValue) {
      defaults[field.key] = { mode: "static", staticValue: field.defaultValue };
    } else {
      defaults[field.key] = { mode: "trigger" };
    }
  }
  return defaults;
}

export default function FieldMapper({ action, onSave, onBack }: Props) {
  const [mappings, setMappings] = useState<Record<string, FieldMapping>>(() =>
    buildDefaults(action)
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMappings(buildDefaults(action));
    setSaved(false);
  }, [action]);

  function setMapping(key: string, update: Partial<FieldMapping>) {
    setMappings((prev) => ({ ...prev, [key]: { ...prev[key], ...update } }));
    setSaved(false);
  }

  function handleSave() {
    onSave({ actionId: action.id, fieldMappings: mappings });
    setSaved(true);
  }

  const isValid = action.fields
    .filter((f) => f.required)
    .every((f) => {
      const m = mappings[f.key];
      if (!m) return false;
      if (m.mode === "trigger") return !!m.triggerField;
      return !!m.staticValue;
    });

  // Build preview object
  const preview: Record<string, string> = {};
  for (const field of action.fields) {
    const m = mappings[field.key];
    if (!m) continue;
    if (m.mode === "trigger" && m.triggerField) {
      preview[field.key] = `{{${m.triggerField}}}`;
    } else if (m.mode === "static" && m.staticValue) {
      preview[field.key] = m.staticValue;
    }
  }

  return (
    <div className="space-y-6">
      {/* Trigger fields reference */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1.5">
          <Zap size={13} />
          Available trigger fields
        </p>
        <div className="flex flex-wrap gap-2">
          {TRIGGER_FIELDS.map((tf) => (
            <span key={tf.key} className="inline-flex flex-col bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs">
              <span className="font-mono text-indigo-600 font-medium">{`{{${tf.key}}}`}</span>
              <span className="text-gray-400 text-[10px]">e.g. {tf.example}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {action.fields.map((field) => (
          <FieldRow
            key={field.key}
            field={field}
            mapping={mappings[field.key] ?? { mode: "trigger" }}
            onChange={(update) => setMapping(field.key, update)}
          />
        ))}
      </div>

      {/* Preview */}
      {Object.keys(preview).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Request preview</p>
          <pre className="text-xs text-gray-700 overflow-auto">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium"
        >
          ← Back
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isValid
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saved ? (
            <>
              <Check size={15} />
              Saved
            </>
          ) : (
            "Save Action"
          )}
        </button>
      </div>
    </div>
  );
}

function FieldRow({
  field,
  mapping,
  onChange,
}: {
  field: ActionField;
  mapping: FieldMapping;
  onChange: (update: Partial<FieldMapping>) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{field.label}</span>
          {field.required && (
            <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
              required
            </span>
          )}
          {field.hint && (
            <span title={field.hint} className="cursor-help">
              <Info size={13} className="text-gray-400" />
            </span>
          )}
        </div>
        {/* Mode toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
          <button
            onClick={() => onChange({ mode: "trigger", staticValue: undefined })}
            className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${
              mapping.mode === "trigger"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Zap size={11} />
            Trigger
          </button>
          <button
            onClick={() => onChange({ mode: "static", triggerField: undefined })}
            className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${
              mapping.mode === "static"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Type size={11} />
            Value
          </button>
        </div>
      </div>

      {/* Input */}
      {mapping.mode === "trigger" ? (
        <TriggerSelect value={mapping.triggerField} onChange={(v) => onChange({ triggerField: v })} />
      ) : (
        <StaticInput field={field} value={mapping.staticValue ?? ""} onChange={(v) => onChange({ staticValue: v })} />
      )}
    </div>
  );
}

function TriggerSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
      >
        <option value="">— select trigger field —</option>
        {TRIGGER_FIELDS.map((tf) => (
          <option key={tf.key} value={tf.key}>
            {`{{${tf.key}}}`} — {tf.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function StaticInput({
  field,
  value,
  onChange,
}: {
  field: ActionField;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "enum" && field.options) {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">— select —</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    );
  }

  if (field.type === "text") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={`Enter ${field.label.toLowerCase()}...`}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
      />
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${field.label.toLowerCase()}...`}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  );
}

"use client";

import { useState } from "react";
import { Zap, ChevronRight, CheckCircle2 } from "lucide-react";
import ActionPicker from "@/components/ActionPicker";
import FieldMapper from "@/components/FieldMapper";
import type { ActionDef, ActionConfig } from "@/lib/types";
import { ACTION_CATALOG } from "@/lib/catalog";

type Step = "pick" | "configure" | "done";

const CATEGORY_ICON: Record<string, string> = {
  Contacts: "👤",
  Deals: "💼",
  Companies: "🏢",
};

export default function Home() {
  const [step, setStep] = useState<Step>("pick");
  const [selectedAction, setSelectedAction] = useState<ActionDef | null>(null);
  const [savedConfig, setSavedConfig] = useState<ActionConfig | null>(null);

  function handleSelectAction(action: ActionDef) {
    setSelectedAction(action);
    setStep("configure");
  }

  function handleSave(config: ActionConfig) {
    setSavedConfig(config);
    setStep("done");
  }

  function handleReset() {
    setSelectedAction(null);
    setSavedConfig(null);
    setStep("pick");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">HubSpot Action Builder</h1>
            <p className="text-xs text-gray-400">Configure what happens when a trigger fires</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb / step indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <StepDot active={step === "pick"} done={step !== "pick"} label="1" />
          <span className={step === "pick" ? "text-gray-800 font-medium" : "text-gray-400"}>
            Choose action
          </span>
          <ChevronRight size={12} />
          <StepDot active={step === "configure"} done={step === "done"} label="2" />
          <span className={step === "configure" ? "text-gray-800 font-medium" : "text-gray-400"}>
            Configure fields
          </span>
          <ChevronRight size={12} />
          <StepDot active={step === "done"} done={false} label="3" />
          <span className={step === "done" ? "text-gray-800 font-medium" : "text-gray-400"}>
            Done
          </span>
        </div>

        {/* Step content */}
        {step === "pick" && (
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">What should happen?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose a HubSpot action to run when the trigger fires.
              </p>
            </div>
            <ActionPicker onSelect={handleSelectAction} />
          </section>
        )}

        {step === "configure" && selectedAction && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>{CATEGORY_ICON[selectedAction.category]}</span>
                <span>{selectedAction.category}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedAction.label}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedAction.description}</p>
            </div>
            <FieldMapper
              action={selectedAction}
              onSave={handleSave}
              onBack={() => setStep("pick")}
            />
          </section>
        )}

        {step === "done" && savedConfig && selectedAction && (
          <DoneScreen
            config={savedConfig}
            action={selectedAction}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span
      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
        done
          ? "bg-indigo-600 text-white"
          : active
          ? "bg-indigo-100 text-indigo-600 ring-2 ring-indigo-400"
          : "bg-gray-200 text-gray-500"
      }`}
    >
      {done ? "✓" : label}
    </span>
  );
}

function DoneScreen({
  config,
  action,
  onReset,
}: {
  config: ActionConfig;
  action: ActionDef;
  onReset: () => void;
}) {
  const filledFields = Object.entries(config.fieldMappings).filter(([, m]) =>
    m.mode === "trigger" ? !!m.triggerField : !!m.staticValue
  );

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <CheckCircle2 size={32} className="text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Action configured</h2>
      <p className="text-sm text-gray-500 mb-8">
        <strong>{action.label}</strong> will run when the trigger fires.
      </p>

      <div className="text-left max-w-lg mx-auto bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Configuration summary
        </p>
        <div className="space-y-2">
          {filledFields.map(([key, mapping]) => {
            const field = action.fields.find((f) => f.key === key);
            return (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{field?.label ?? key}</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                  mapping.mode === "trigger"
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {mapping.mode === "trigger"
                    ? `{{${mapping.triggerField}}}`
                    : mapping.staticValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Configure another action
        </button>
      </div>
    </div>
  );
}

"use client";

import {
  UserPlus, UserPen, Search, Briefcase, ArrowRightCircle,
  PenLine, Link, Building2,
} from "lucide-react";
import type { ActionDef } from "@/lib/types";
import { ACTION_CATALOG, CATEGORIES } from "@/lib/catalog";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  UserPlus, UserPen, Search, Briefcase, ArrowRightCircle,
  PenLine, Link, Building2,
};

const CATEGORY_COLOR: Record<string, string> = {
  Contacts:  "bg-blue-50 text-blue-700 border-blue-200",
  Deals:     "bg-orange-50 text-orange-700 border-orange-200",
  Companies: "bg-purple-50 text-purple-700 border-purple-200",
};

const METHOD_COLOR: Record<string, string> = {
  POST:  "bg-green-100 text-green-700",
  PATCH: "bg-yellow-100 text-yellow-700",
  PUT:   "bg-blue-100 text-blue-700",
};

interface Props {
  onSelect: (action: ActionDef) => void;
}

export default function ActionPicker({ onSelect }: Props) {
  return (
    <div className="space-y-8">
      {CATEGORIES.map((category) => {
        const actions = ACTION_CATALOG.filter((a) => a.category === category);
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLOR[category]}`}>
                {category}
              </span>
              <span className="text-xs text-gray-400">{actions.length} actions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {actions.map((action) => (
                <ActionCard key={action.id} action={action} onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActionCard({ action, onSelect }: { action: ActionDef; onSelect: (a: ActionDef) => void }) {
  const Icon = ICON_MAP[action.icon] ?? Briefcase;
  const requiredCount = action.fields.filter((f) => f.required).length;

  return (
    <button
      onClick={() => onSelect(action)}
      className="group text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
          <Icon size={18} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-900 truncate">{action.label}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${METHOD_COLOR[action.api.method]}`}>
              {action.api.method}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{action.description}</p>
          <p className="mt-2 text-[11px] text-gray-400">
            {requiredCount} required field{requiredCount !== 1 ? "s" : ""} · {action.fields.length} total
          </p>
        </div>
      </div>
    </button>
  );
}

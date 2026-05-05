"use client";

import { useState } from "react";
import type { CampaignInput, CampaignObjective, Tone, Platform } from "@/lib/types";
import { PRESETS } from "@/lib/presets";

const OBJECTIVES: { value: CampaignObjective; label: string }[] = [
  { value: "brand_awareness", label: "Brand Awareness" },
  { value: "lead_generation", label: "Lead Generation" },
  { value: "sales_conversion", label: "Sales Conversion" },
  { value: "app_installs", label: "App Installs" },
  { value: "engagement", label: "Engagement" },
  { value: "retargeting", label: "Retargeting" },
];

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "playful", label: "Playful" },
  { value: "luxury", label: "Luxury" },
  { value: "urgent", label: "Urgent" },
  { value: "inspirational", label: "Inspirational" },
  { value: "educational", label: "Educational" },
];

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: "meta_ads", label: "Meta Ads", icon: "◈" },
  { value: "instagram", label: "Instagram", icon: "◉" },
  { value: "facebook", label: "Facebook", icon: "◈" },
  { value: "tiktok", label: "TikTok", icon: "♪" },
  { value: "linkedin", label: "LinkedIn", icon: "◆" },
];

const BLANK: CampaignInput = {
  brandName: "",
  productDescription: "",
  industry: "",
  objective: "brand_awareness",
  targetAudience: "",
  region: "",
  tone: "professional",
  platforms: ["meta_ads", "instagram"],
  competitors: "",
  budget: "",
  duration: "",
};

interface Props {
  onSubmit: (input: CampaignInput) => void;
  isLoading: boolean;
}

export default function CampaignForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<CampaignInput>(BLANK);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  function applyPreset(idx: number) {
    setActivePreset(idx);
    setForm(PRESETS[idx].input);
  }

  function togglePlatform(p: Platform) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.platforms.length === 0) return;
    onSubmit(form);
  }

  const isValid =
    form.brandName.trim() &&
    form.productDescription.trim().length >= 10 &&
    form.industry.trim() &&
    form.targetAudience.trim().length >= 5 &&
    form.region.trim() &&
    form.platforms.length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Demo Presets */}
      <div>
        <p className="section-title">Demo Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(idx)}
              className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                activePreset === idx
                  ? "border-gold-600 bg-gold-500/10 text-gold-400"
                  : "border-surface-500 bg-surface-700 text-gray-400 hover:border-surface-400 hover:text-white"
              }`}
            >
              <span className="text-base mr-1.5">{preset.emoji}</span>
              <span className="text-xs font-semibold">{preset.label}</span>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Brand & Product */}
      <div>
        <p className="section-title">Brand & Product</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand Name" required>
              <input
                className="input-field"
                placeholder="e.g. Lumière"
                value={form.brandName}
                onChange={(e) => setForm((p) => ({ ...p, brandName: e.target.value }))}
              />
            </Field>
            <Field label="Industry" required>
              <input
                className="input-field"
                placeholder="e.g. Beauty & Skincare"
                value={form.industry}
                onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Product / Service Description" required>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Describe your product, its key features, price point, and what makes it unique..."
              value={form.productDescription}
              onChange={(e) => setForm((p) => ({ ...p, productDescription: e.target.value }))}
            />
          </Field>
        </div>
      </div>

      <Divider />

      {/* Campaign Settings */}
      <div>
        <p className="section-title">Campaign Settings</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Campaign Objective" required>
              <select
                className="input-field"
                value={form.objective}
                onChange={(e) =>
                  setForm((p) => ({ ...p, objective: e.target.value as CampaignObjective }))
                }
              >
                {OBJECTIVES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tone of Voice" required>
              <select
                className="input-field"
                value={form.tone}
                onChange={(e) => setForm((p) => ({ ...p, tone: e.target.value as Tone }))}
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Region / Country" required>
              <input
                className="input-field"
                placeholder="e.g. United States"
                value={form.region}
                onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
              />
            </Field>
            <Field label="Campaign Duration">
              <input
                className="input-field"
                placeholder="e.g. 4 weeks"
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              />
            </Field>
          </div>
        </div>
      </div>

      <Divider />

      {/* Target Audience */}
      <div>
        <p className="section-title">Target Audience</p>
        <Field label="Audience Description" required>
          <textarea
            className="input-field resize-none"
            rows={2}
            placeholder="Describe demographics, interests, behaviors, and pain points..."
            value={form.targetAudience}
            onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
          />
        </Field>
      </div>

      <Divider />

      {/* Platforms */}
      <div>
        <p className="section-title">Platforms</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => {
            const selected = form.platforms.includes(platform.value);
            return (
              <button
                key={platform.value}
                type="button"
                onClick={() => togglePlatform(platform.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                  selected
                    ? "border-gold-600 bg-gold-500/10 text-gold-400"
                    : "border-surface-500 bg-surface-700 text-gray-400 hover:border-surface-400"
                }`}
              >
                <span>{platform.icon}</span>
                {platform.label}
              </button>
            );
          })}
        </div>
        {form.platforms.length === 0 && (
          <p className="text-xs text-red-400 mt-1.5">Select at least one platform</p>
        )}
      </div>

      <Divider />

      {/* Optional */}
      <div>
        <p className="section-title">Optional</p>
        <div className="space-y-3">
          <Field label="Competitors">
            <input
              className="input-field"
              placeholder="e.g. La Mer, SK-II, SkinCeuticals"
              value={form.competitors}
              onChange={(e) => setForm((p) => ({ ...p, competitors: e.target.value }))}
            />
          </Field>
          <Field label="Monthly Budget">
            <input
              className="input-field"
              placeholder="e.g. $5,000/month"
              value={form.budget}
              onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
            />
          </Field>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn-primary w-full text-sm mt-2 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <span>⚡</span>
            Generate Campaign
          </>
        )}
      </button>
    </form>
  );
}

function Divider() {
  return <div className="border-t border-surface-600" />;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-gold-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

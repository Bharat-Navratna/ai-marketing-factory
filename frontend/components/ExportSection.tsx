"use client";

import { useState } from "react";
import type { FullCampaign } from "@/lib/types";

interface Props {
  campaign: FullCampaign;
}

export default function ExportSection({ campaign }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function downloadJson(data: object, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const slug = campaign.input.brandName.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Export Campaign Package</h3>
        <span className="badge-gold">Export Ready</span>
      </div>
      <p className="text-sm text-gray-400">
        These packages are ready to upload into Meta Ads Manager and TikTok Ads Manager. Real API
        publishing requires additional integration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Meta Package */}
        <ExportCard
          title="Meta Ads Package"
          icon="◈"
          color="blue"
          description="Facebook + Instagram ready"
          onCopy={() =>
            copyToClipboard(JSON.stringify(campaign.exportPackage.meta, null, 2), "meta")
          }
          onDownload={() =>
            downloadJson(campaign.exportPackage.meta, `${slug}-meta-ads.json`)
          }
          copied={copied === "meta"}
        />

        {/* TikTok Package */}
        <ExportCard
          title="TikTok Ads Package"
          icon="♪"
          color="purple"
          description="TikTok Ads Manager ready"
          onCopy={() =>
            copyToClipboard(JSON.stringify(campaign.exportPackage.tiktok, null, 2), "tiktok")
          }
          onDownload={() =>
            downloadJson(campaign.exportPackage.tiktok, `${slug}-tiktok-ads.json`)
          }
          copied={copied === "tiktok"}
        />

        {/* Full Campaign JSON */}
        <ExportCard
          title="Full Campaign JSON"
          icon="{ }"
          color="gold"
          description="Complete campaign data"
          onCopy={() =>
            copyToClipboard(campaign.exportPackage.campaignJson, "full")
          }
          onDownload={() =>
            downloadJson(JSON.parse(campaign.exportPackage.campaignJson), `${slug}-campaign.json`)
          }
          copied={copied === "full"}
        />
      </div>

      {/* Meta Ad preview */}
      <div className="card mt-2">
        <p className="section-title">Meta Ad — Export Preview</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <PreviewRow label="Format" value={campaign.exportPackage.meta.adFormat} />
          <PreviewRow label="Objective" value={campaign.exportPackage.meta.campaignObjective} />
          <PreviewRow label="Headline" value={campaign.exportPackage.meta.headline} />
          <PreviewRow label="CTA" value={campaign.exportPackage.meta.callToAction} />
          <div className="md:col-span-2">
            <PreviewRow label="Primary Text" value={campaign.exportPackage.meta.primaryText} />
          </div>
          <PreviewRow label="Placement" value={campaign.exportPackage.meta.placementRecommendation} />
          <PreviewRow label="Est. Reach" value={campaign.exportPackage.meta.estimatedReach} />
          <div className="md:col-span-2">
            <p className="text-gray-500 text-xs mb-1">Audience Targeting</p>
            <div className="bg-surface-700 rounded-lg p-3 space-y-1">
              <TargetRow k="Age" v={campaign.exportPackage.meta.audienceTargeting.ageRange} />
              <TargetRow k="Gender" v={campaign.exportPackage.meta.audienceTargeting.genders} />
              <TargetRow
                k="Interests"
                v={campaign.exportPackage.meta.audienceTargeting.interests.join(", ")}
              />
              <TargetRow
                k="Locations"
                v={campaign.exportPackage.meta.audienceTargeting.locations.join(", ")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TikTok Ad preview */}
      <div className="card">
        <p className="section-title">TikTok Ad — Export Preview</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <PreviewRow label="Format" value={campaign.exportPackage.tiktok.adFormat} />
          <PreviewRow label="Objective" value={campaign.exportPackage.tiktok.campaignObjective} />
          <PreviewRow label="Hook Line" value={campaign.exportPackage.tiktok.hookLine} />
          <PreviewRow label="CTA" value={campaign.exportPackage.tiktok.callToAction} />
          <PreviewRow label="On-Screen Text" value={campaign.exportPackage.tiktok.onScreenText} />
          <PreviewRow label="Trending Sounds" value={campaign.exportPackage.tiktok.trendingSounds} />
          <div className="md:col-span-2">
            <p className="text-gray-500 text-xs mb-1">Video Script</p>
            <div className="bg-surface-700 rounded-lg p-3 text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">
              {campaign.exportPackage.tiktok.videoScript}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportCard({
  title,
  icon,
  color,
  description,
  onCopy,
  onDownload,
  copied,
}: {
  title: string;
  icon: string;
  color: "gold" | "blue" | "purple";
  description: string;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}) {
  const colors = {
    gold: "border-gold-600/40 bg-gold-500/5 text-gold-400",
    blue: "border-blue-500/40 bg-blue-500/5 text-blue-400",
    purple: "border-purple-500/40 bg-purple-500/5 text-purple-400",
  };

  return (
    <div className={`card-sm border ${colors[color]} flex flex-col gap-3`}>
      <div>
        <div className="text-xl mb-1">{icon}</div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onCopy}
          className="btn-secondary text-xs py-1.5 px-3 flex-1"
        >
          {copied ? "Copied!" : "Copy JSON"}
        </button>
        <button
          onClick={onDownload}
          className="btn-secondary text-xs py-1.5 px-3 flex-1"
        >
          Download
        </button>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  );
}

function TargetRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-gray-500 w-16 flex-shrink-0">{k}</span>
      <span className="text-gray-300">{v}</span>
    </div>
  );
}

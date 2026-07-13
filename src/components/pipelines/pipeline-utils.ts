import type { TFunction } from "i18next";

const STAGE_KEYS: Record<string, string> = {
  "New Lead": "pipelines.default_stages.new_lead",
  "Qualified": "pipelines.default_stages.qualified",
  "Proposal Sent": "pipelines.default_stages.proposal_sent",
  "Negotiation": "pipelines.default_stages.negotiation",
  "Won": "pipelines.default_stages.won",
};

export function translateStageName(name: string, t: TFunction): string {
  const key = STAGE_KEYS[name];
  return key ? t(key) : name;
}

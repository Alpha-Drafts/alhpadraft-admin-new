export const getStatusColor = (status: string): string => {
  if (!status) return "text-muted-600"; // fallback for empty status

  const statusMap: Record<string, string> = {
    // Plans
    starter: "text-primary-600",
    student: "text-amber-600",
    professional: "text-orange-600",

    // project statuses
    draft: "text-orange-600",
    in_progress: "text-yellow-600",
    completed: "text-green-600",
    archived: "text-neutral-600",

    // transaction statuses
    active: "text-green-600",
    inactive: "text-orange-600",

    // project types
    essay: "text-blue-600",
    research_paper: "text-purple-600",
    thesis: "text-pink-600",
    reports: "text-teal-600",
    literature_review: "text-emerald-600",
    dissertation: "text-orange-600",
    proposal: "text-red-600",
    case_study: "text-yellow-600",
    other: "text-gray-600",
  };

  return statusMap[status.toLowerCase()] || "text-muted-600"; // fallback
};

export const getStatusBgColor = (status: string): string => {
  if (!status) return "bg-muted-600/5"; // fallback for empty status

  const statusMap: Record<string, string> = {
    // Plans
    starter: "bg-primary-600/5",
    student: "bg-amber-600/5",
    professional: "bg-orange-600/5",

    // project statuses
    draft: "bg-orange-600/5",
    in_progress: "bg-yellow-600/5",
    completed: "bg-green-600/5",
    archived: "bg-neutral-600/5",

    // transaction statuses
    active: "bg-green-600/5",
    inactive: "bg-orange-600/5",

    // project types
    essay: "bg-blue-600/5",
    research_paper: "bg-purple-600/5",
    thesis: "bg-pink-600/5",
    report: "bg-teal-600/5",
    literature_review: "bg-emerald-600/5",
    dissertation: "bg-orange-600/5",
    proposal: "bg-red-600/5",
    case_study: "bg-yellow-600/5",
    other: "bg-gray-600/5",
  };

  return statusMap[status.toLowerCase()] || "bg-muted-600/5"; // fallback
};

export const getStatusBorderColor = (status: string): string => {
  if (!status) return "border-muted-600/10"; // fallback for empty status

  const statusMap: Record<string, string> = {
    // Plans
    starter: "border-primary-600/10",
    student: "border-amber-600/10",
    professional: "border-orange-600/10",

    // project statuses
    draft: "border-orange-600/10",
    in_progress: "border-yellow-600/10",
    completed: "border-green-600/10",
    archived: "border-neutral-600/10",

    // transaction statuses
    active: "border-green-600/10",
    inactive: "border-orange-600/10",

    // project types
    essay: "border-blue-600/10",
    research_paper: "border-purple-600/10",
    thesis: "border-pink-600/10",
    report: "border-teal-600/10",
    literature_review: "border-emerald-600/10",
    dissertation: "border-orange-600/10",
    proposal: "border-red-600/10",
    case_study: "border-yellow-600/10",
    other: "border-gray-600/10",
  };

  return statusMap[status.toLowerCase()] || "border-muted-600/10"; // fallback
};

// Returns a color from green (low score) to red (high score)
export function getScoreColor(score: number | undefined | null): string {
  if (typeof score !== "number") return "#d1d5db"; // fallback gray
  // Interpolate from green (#22c55e) to red (#ef4444)
  const r1 = 34,
    g1 = 197,
    b1 = 94; // green
  const r2 = 239,
    g2 = 68,
    b2 = 68; // red
  const percent = Math.max(0, Math.min(1, score));
  const r = Math.round(r1 + (r2 - r1) * percent);
  const g = Math.round(g1 + (g2 - g1) * percent);
  const b = Math.round(b1 + (b2 - b1) * percent);
  return `rgb(${r},${g},${b})`;
}

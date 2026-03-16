// features/report/api.ts
import { api } from "@/shared/api/client";
import type { Report } from "@/shared/types/domain";

export function getReport(sessionId: string) {
  return api<Report>(`/reports/${sessionId}`);
}

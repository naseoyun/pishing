// features/session/api.ts
import { api } from "@/shared/api/client";
import { SessionResponse } from "@/shared/types/domain";

export function createSession() {
  return api<SessionResponse>("/sessions", { method: "POST" });
}

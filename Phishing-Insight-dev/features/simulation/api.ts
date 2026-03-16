// features/simulation/api.ts
import { api } from "@/shared/api/client";
import { EventResponse } from "@/shared/types/domain";

export function sendEvent(payload: {
  session_id: string;
  current_step_id: string;
  option_id: string;
  step_index: number;
  trigger?: string | null;
  verification?: boolean | null;
}) {
  console.log("SEND EVENT PAYLOAD", payload);

  return api<EventResponse>("/events/", {
    method: "POST",
    body: JSON.stringify({
      session_id: payload.session_id,
      type: "click",
      payload: {
        current_step_id: payload.current_step_id,
        option_id: payload.option_id,
        step_index: payload.step_index,
        trigger: payload.trigger ?? null,
        verification: payload.verification ?? null,
      },
      timestamp: new Date().toISOString(),
    }),
  });
}

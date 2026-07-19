import React from "react";
import { Mic, Sparkles } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

export default function InterviewCoachPage() {
  const { profile } = useProfile();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2
          className="text-2xl font-semibold text-foreground tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Interview Coach
        </h2>
        <p className="text-muted-foreground text-sm">
          A live, voice-based mock interview — practice out loud, get real-time
          feedback.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          Tell the coach your target role
          {profile.currentRole ? ` (e.g. ${profile.currentRole})` : ""} and
          target country to begin.
        </div>

        <div className="w-full flex justify-center py-4">
          <elevenlabs-convai agent-id="agent_7901kxv4p0cpf7fsc3rj1yg8xsma"></elevenlabs-convai>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-4 w-full justify-center">
          <Mic className="w-3 h-3" />
          Click the widget above and allow microphone access to start speaking.
        </div>
      </div>
    </div>
  );
}

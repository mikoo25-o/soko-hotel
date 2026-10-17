import { WifiOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/ui/Button";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
      <Logo variant="mark" className="h-16 w-16" />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warn/10 text-warn">
        <WifiOff className="h-6 w-6" aria-hidden />
      </div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">You are offline</h1>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          SokoHotel needs a connection so orders and payments are saved safely. Nothing was lost. Reconnect and try again.
        </p>
      </div>
      <LinkButton href="/">Try again</LinkButton>
    </main>
  );
}

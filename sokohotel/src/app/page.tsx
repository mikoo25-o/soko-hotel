import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, UtensilsCrossed, Users } from "lucide-react";
import { HeroSlides } from "@/components/HeroSlides";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/ui/Button";
import { TAGLINE } from "@/lib/constants";

const BENEFITS = [
  { icon: UtensilsCrossed, title: "Easy Order Management" },
  { icon: ChartNoAxesCombined, title: "Real-Time Reports" },
  { icon: Users, title: "Team Collaboration" },
];

export default function LandingPage() {
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-forest text-white">
      <HeroSlides />

      <header className="relative z-10 flex items-center gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] lg:px-12 lg:pt-8">
        <Logo variant="mark" white priority className="h-14 w-14 shrink-0 lg:h-16 lg:w-16" />
        <div className="min-w-0 leading-tight">
          <Logo variant="wordmark" white className="h-6 w-auto lg:h-7" />
          <p className="mt-1 text-[13px] text-white/90 lg:text-sm">{TAGLINE}</p>
        </div>
      </header>

      <div className="relative z-10 mt-auto flex flex-col lg:mt-0 lg:flex-1 lg:justify-center lg:px-12">
        <section
          aria-labelledby="hero-title"
          className="rounded-t-3xl bg-forest/95 px-5 pb-16 pt-8 sm:px-8 lg:max-w-xl lg:rounded-3xl lg:p-10 lg:pb-12"
        >
          <h1 id="hero-title" className="font-display text-[2.5rem] font-bold leading-[1.08] sm:text-5xl">
            Run Your
            <br />
            Restaurant
            <br />
            <span className="text-action">Smarter</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
            Manage orders, track sales, control stock, and grow your business — all in one place.
          </p>

          <ul className="mt-6 grid grid-cols-3 gap-3">
            {BENEFITS.map(({ icon: Icon, title }) => (
              <li key={title} className="flex flex-col items-start gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-action/20 text-action">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="text-[13px] font-medium leading-snug text-white sm:text-sm">{title}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-4">
            <LinkButton href="/signup" size="lg" block className="!bg-action !text-forest hover:!bg-white">
              Get Started <ArrowRight className="h-5 w-5" aria-hidden />
            </LinkButton>
            <p className="text-center text-sm text-white/85">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-action underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

import { config } from "@/lib/config";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-ink-200">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(0,0,0,0.06),transparent_42%)]"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-ink-900/[0.04] blur-3xl animate-float"
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-0">
        <div className="order-2 md:order-1">
          <p className="animate-fade-up text-xs uppercase tracking-[0.35em] text-ink-500">
            On-chain support
          </p>
          <h1 className="animate-fade-up-delay mt-4 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-ink-950 sm:text-5xl md:text-6xl lg:text-7xl">
            {config.brand}
          </h1>
          <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-base leading-relaxed text-ink-600 md:text-lg">
            {config.tagline}
          </p>

          <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#donate"
              className="group inline-flex items-center gap-3 border border-ink-900 bg-ink-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-ink-900"
            >
              Support with ETH
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
            <span className="text-xs uppercase tracking-[0.22em] text-ink-400">
              Sepolia testnet
            </span>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <div className="relative animate-fade-in">
            <span
              aria-hidden
              className="absolute -inset-3 rounded-full border border-ink-200"
            />
            <span
              aria-hidden
              className="absolute -inset-6 rounded-full border border-ink-100 animate-pulse-ring"
            />
            <div className="relative h-56 w-56 overflow-hidden rounded-full border border-ink-200 bg-ink-100 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-[22rem] lg:w-[22rem]">
              <img
                src={config.avatarUrl}
                alt={config.brand}
                className="h-full w-full object-cover object-[center_18%] transition duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

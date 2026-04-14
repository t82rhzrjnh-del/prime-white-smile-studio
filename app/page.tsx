"use client";

import { useState, useEffect, useRef } from "react";

// --- Scroll Animation Hook ---
function useScrollReveal(options: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}

// --- Staggered children reveal ---
function RevealGroup({ children, className = "", delay = 120 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(36px)",
                transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${i * delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${i * delay}ms`,
              }}
            >
              {child}
            </div>
          ))
        : (
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(36px)",
              transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {children}
          </div>
        )}
    </div>
  );
}

function Reveal({ children, className = "", delay = 0, direction = "up" }: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right" | "none" }) {
  const [ref, isVisible] = useScrollReveal();
  const transforms = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : transforms[direction],
        transition: `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// --- Gold Divider ---
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #C5A55A)" }} />
      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0L6.12 3.88L10 5L6.12 6.12L5 10L3.88 6.12L0 5L3.88 3.88Z" fill="#C5A55A" /></svg>
      <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #C5A55A, transparent)" }} />
    </div>
  );
}

// --- Section Label ---
function SectionLabel({ text }: { text: string }) {
  return (
    <p className="uppercase tracking-[0.35em] text-xs font-medium mb-3" style={{ color: "#C5A55A" }}>
      {text}
    </p>
  );
}

// --- MAIN COMPONENT ---
export default function PrimeSmileStudio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Pricing", id: "pricing" },
    { label: "Results", id: "results" },
    { label: "Book", id: "booking" },
    { label: "Aftercare", id: "aftercare" },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .font-sans-elegant { font-family: 'Montserrat', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        .gold-gradient { background: linear-gradient(135deg, #C5A55A 0%, #E8D5A3 40%, #C5A55A 60%, #A8893D 100%); }
        .gold-text { background: linear-gradient(135deg, #C5A55A 0%, #E8D5A3 50%, #C5A55A 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .gold-border { border-color: #C5A55A; }

        .pricing-card {
          transition: transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s cubic-bezier(.22,1,.36,1);
        }
        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px -12px rgba(197,165,90,0.18), 0 8px 24px -8px rgba(0,0,0,0.06);
        }

        .cta-btn {
          position: relative; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cta-btn::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        .cta-btn:hover::before { left: 100%; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px -6px rgba(197,165,90,0.45); }

        .ba-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .ba-card:hover {
          transform: scale(1.03);
          box-shadow: 0 16px 40px -10px rgba(0,0,0,0.1);
        }

        .aftercare-card {
          transition: transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.4s ease;
        }
        .aftercare-card:hover {
          transform: translateY(-4px);
          border-color: #C5A55A;
        }

        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 50%; width: 0; height: 1px;
          background: #C5A55A; transition: width 0.3s ease, left 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; left: 0; }

        .hero-shimmer {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(197,165,90,0.04) 50%, transparent 70%);
          animation: shimmer 6s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0; transform: translateX(-60%); }
          50% { opacity: 1; transform: translateX(60%); }
        }

        .float-subtle {
          animation: floatSubtle 6s ease-in-out infinite;
        }
        @keyframes floatSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-field {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input-field:focus {
          border-color: #C5A55A;
          box-shadow: 0 0 0 3px rgba(197,165,90,0.1);
          outline: none;
        }

        .grain-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        ::selection { background: rgba(197,165,90,0.2); }
      `}</style>

      <div className="grain-overlay" />

      {/* ===== NAVIGATION ===== */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(197,165,90,0.15)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="font-serif text-2xl font-semibold tracking-wide" style={{ color: "#C5A55A" }}>
            Prime Smile Studio
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)} className="nav-link font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium" style={{ color: "#3A3A3A" }}>
                {link.label}
              </button>
            ))}
          </div>

          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className="block w-6 h-px transition-all duration-300" style={{ background: "#C5A55A", transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none" }} />
            <span className="block w-6 h-px transition-all duration-300" style={{ background: "#C5A55A", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-6 h-px transition-all duration-300" style={{ background: "#C5A55A", transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none" }} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t" style={{ borderColor: "rgba(197,165,90,0.15)", animation: "fadeInDown 0.3s ease" }}>
            <div className="flex flex-col items-center py-6 gap-5">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)} className="font-sans-elegant text-sm uppercase tracking-[0.2em] font-medium" style={{ color: "#3A3A3A" }}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 100%)" }}>
        <div className="hero-shimmer" />

        <div className="absolute top-24 left-8 w-20 h-20 border-t border-l opacity-30" style={{ borderColor: "#C5A55A" }} />
        <div className="absolute bottom-12 right-8 w-20 h-20 border-b border-r opacity-30" style={{ borderColor: "#C5A55A" }} />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <Reveal delay={0}>
            <SectionLabel text="Cosmetic Teeth Whitening" />
          </Reveal>
          <Reveal delay={200}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-6" style={{ color: "#2A2A2A" }}>
              Your Brightest<br />
              <span className="gold-text font-medium italic">Smile</span> Awaits
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="font-sans-elegant text-sm md:text-base font-light leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: "#777" }}>
              Reveal the confidence that comes with a radiant, naturally brighter smile. Premium cosmetic whitening in the North East of England.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <button onClick={() => scrollTo("booking")} className="cta-btn gold-gradient text-white font-sans-elegant text-xs uppercase tracking-[0.25em] font-medium px-10 py-4 rounded-none">
              Book Your Session
            </button>
          </Reveal>
          <Reveal delay={800}>
            <div className="mt-16 float-subtle">
              <svg width="20" height="32" viewBox="0 0 20 32" fill="none" className="mx-auto opacity-40">
                <rect x="7" y="0" width="6" height="32" rx="3" stroke="#C5A55A" strokeWidth="1" fill="none" />
                <circle cx="10" cy="8" r="2" fill="#C5A55A" opacity="0.6">
                  <animate attributeName="cy" values="8;20;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about" className="py-24 md:py-32 px-6" style={{ background: "#FDFBF7" }}>
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <SectionLabel text="The Treatment" />
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-4" style={{ color: "#2A2A2A" }}>
              What Is Cosmetic<br />Teeth Whitening?
            </h2>
          </Reveal>
          <Reveal delay={250}>
            <GoldDivider />
          </Reveal>
          <Reveal delay={350}>
            <p className="font-sans-elegant text-sm md:text-base font-light leading-[1.9] mt-8 max-w-2xl mx-auto" style={{ color: "#666" }}>
              A professional cosmetic treatment designed to lighten the natural shade of your teeth and reduce stains caused by coffee, tea, red wine, smoking, and everyday habits. Each session takes just 60 minutes in a relaxed, comfortable setting. Results vary between individuals but are long-lasting when supported by good aftercare and daily habits.
            </p>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" delay={150}>
            {[
              { icon: "◷", title: "60 Minutes", desc: "Quick, comfortable sessions that fit around your schedule" },
              { icon: "✦", title: "Visible Results", desc: "Noticeably brighter teeth from your very first session" },
              { icon: "♡", title: "Safe & Gentle", desc: "Non-invasive cosmetic treatment with no damage to enamel" },
            ].map((item, i) => (
              <div key={i} className="text-center py-8 px-6">
                <div className="text-3xl mb-4" style={{ color: "#C5A55A" }}>{item.icon}</div>
                <h3 className="font-serif text-lg font-medium mb-2" style={{ color: "#2A2A2A" }}>{item.title}</h3>
                <p className="font-sans-elegant text-xs font-light leading-relaxed" style={{ color: "#888" }}>{item.desc}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="pricing" className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <SectionLabel text="Investment" />
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-4" style={{ color: "#2A2A2A" }}>
              Session Pricing
            </h2>
          </Reveal>
          <Reveal delay={250}>
            <GoldDivider />
          </Reveal>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16" delay={180}>
            <div className="pricing-card border rounded-none p-8 md:p-10 flex flex-col items-center text-center" style={{ borderColor: "rgba(197,165,90,0.25)" }}>
              <p className="font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium mb-6" style={{ color: "#999" }}>Standard</p>
              <p className="font-serif text-5xl font-light mb-1" style={{ color: "#2A2A2A" }}>£85</p>
              <p className="font-sans-elegant text-xs font-light mb-6" style={{ color: "#aaa" }}>per session</p>
              <div className="w-8 h-px mb-6" style={{ background: "#C5A55A" }} />
              <p className="font-serif text-lg font-medium mb-2" style={{ color: "#2A2A2A" }}>60 Minute Session</p>
              <p className="font-sans-elegant text-xs font-light leading-relaxed" style={{ color: "#888" }}>
                Our full whitening treatment. Perfect for first-timers or anyone wanting maximum results.
              </p>
              <button
                onClick={() => scrollTo("booking")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#C5A55A";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#C5A55A";
                }}
                className="mt-8 font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium py-3 px-8 border transition-all duration-300 hover:text-white"
                style={{ borderColor: "#C5A55A", color: "#C5A55A", background: "transparent" }}
              >
                Book Now
              </button>
            </div>

            <div className="pricing-card relative border-2 rounded-none p-8 md:p-10 flex flex-col items-center text-center md:-mt-4 md:mb-0" style={{ borderColor: "#C5A55A", background: "linear-gradient(180deg, #FDFBF7 0%, #FFFFFF 100%)" }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient text-white font-sans-elegant text-[10px] uppercase tracking-[0.25em] font-semibold px-5 py-1.5">
                Best Value
              </div>
              <p className="font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium mb-6" style={{ color: "#C5A55A" }}>Popular</p>
              <p className="font-serif text-5xl font-light mb-1" style={{ color: "#2A2A2A" }}>£140</p>
              <p className="font-sans-elegant text-xs font-light mb-6" style={{ color: "#aaa" }}>for two people</p>
              <div className="w-8 h-px mb-6" style={{ background: "#C5A55A" }} />
              <p className="font-serif text-lg font-medium mb-2" style={{ color: "#2A2A2A" }}>Bring A Friend</p>
              <p className="font-sans-elegant text-xs font-light leading-relaxed" style={{ color: "#888" }}>
                60 minutes each. Share the experience and save — the perfect excuse for a pamper day together.
              </p>
              <button onClick={() => scrollTo("booking")} className="cta-btn mt-8 gold-gradient text-white font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium py-3 px-8 rounded-none">
                Book For Two
              </button>
            </div>

            <div className="pricing-card border rounded-none p-8 md:p-10 flex flex-col items-center text-center" style={{ borderColor: "rgba(197,165,90,0.25)" }}>
              <p className="font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium mb-6" style={{ color: "#999" }}>Maintenance</p>
              <p className="font-serif text-5xl font-light mb-1" style={{ color: "#2A2A2A" }}>£65</p>
              <p className="font-sans-elegant text-xs font-light mb-6" style={{ color: "#aaa" }}>per session</p>
              <div className="w-8 h-px mb-6" style={{ background: "#C5A55A" }} />
              <p className="font-serif text-lg font-medium mb-2" style={{ color: "#2A2A2A" }}>40 Minute Top Up</p>
              <p className="font-sans-elegant text-xs font-light leading-relaxed" style={{ color: "#888" }}>
                Keep your results fresh. Ideal for returning clients who want to maintain their brightest smile.
              </p>
              <button
                onClick={() => scrollTo("booking")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#C5A55A";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#C5A55A";
                }}
                className="mt-8 font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium py-3 px-8 border transition-all duration-300 hover:text-white"
                style={{ borderColor: "#C5A55A", color: "#C5A55A", background: "transparent" }}
              >
                Book Now
              </button>
            </div>
          </RevealGroup>
        </div>
      </section>

      <section id="results" className="py-24 md:py-32 px-6" style={{ background: "#FDFBF7" }}>
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <SectionLabel text="Transformations" />
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-4" style={{ color: "#2A2A2A" }}>
              Real Results
            </h2>
          </Reveal>
          <Reveal delay={250}>
            <GoldDivider />
          </Reveal>
          <Reveal delay={350}>
            <p className="font-sans-elegant text-sm font-light mt-6 mb-14 max-w-md mx-auto" style={{ color: "#888" }}>
              See the difference a single session can make. Results from real clients.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" delay={140}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="ba-card overflow-hidden" style={{ border: "1px solid rgba(197,165,90,0.15)" }}>
                <div className="grid grid-cols-2">
                  <div className="aspect-square flex items-center justify-center" style={{ background: "#E8E4DE" }}>
                    <span className="font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium" style={{ color: "#aaa" }}>Before</span>
                  </div>
                  <div className="aspect-square flex items-center justify-center" style={{ background: "#F5F1EB" }}>
                    <span className="font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium" style={{ color: "#C5A55A" }}>After</span>
                  </div>
                </div>
                <div className="py-3 px-4 text-center" style={{ background: "#fff" }}>
                  <p className="font-sans-elegant text-[10px] uppercase tracking-[0.15em]" style={{ color: "#bbb" }}>Client {n} — 60 Minute Session</p>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="booking" className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <SectionLabel text="Book Now" />
            </Reveal>
            <Reveal delay={150}>
              <h2 className="font-serif text-3xl md:text-5xl font-light mb-4" style={{ color: "#2A2A2A" }}>
                Ready To Glow?
              </h2>
            </Reveal>
            <Reveal delay={250}>
              <GoldDivider />
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Reveal direction="right">
              <div className="text-center md:text-left">
                <h3 className="font-serif text-2xl font-light mb-4" style={{ color: "#2A2A2A" }}>
                  DM Us On Instagram
                </h3>
                <p className="font-sans-elegant text-sm font-light leading-relaxed mb-8" style={{ color: "#888" }}>
                  The quickest way to book your session. Send us a message and we'll get you booked in within 24 hours.
                </p>
                <a
                  href="https://instagram.com/primesmilestudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn inline-flex items-center gap-3 gold-gradient text-white font-sans-elegant text-xs uppercase tracking-[0.2em] font-medium px-8 py-4 rounded-none"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  @primesmilestudio
                </a>
                <div className="mt-10 flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(197,165,90,0.1)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <p className="font-sans-elegant text-xs font-light" style={{ color: "#999" }}>Based in the North East of England</p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div className="p-8 md:p-10" style={{ background: "#FDFBF7", border: "1px solid rgba(197,165,90,0.15)" }}>
                <h3 className="font-serif text-xl font-light mb-6" style={{ color: "#2A2A2A" }}>
                  Send An Enquiry
                </h3>
                {formSent ? (
                  <div className="text-center py-12">
                    <div className="text-3xl mb-3" style={{ color: "#C5A55A" }}>✓</div>
                    <p className="font-serif text-lg" style={{ color: "#2A2A2A" }}>Thank you!</p>
                    <p className="font-sans-elegant text-xs font-light mt-1" style={{ color: "#999" }}>We'll be in touch shortly.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="font-sans-elegant text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: "#999" }}>Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field w-full bg-white border px-4 py-3 font-sans-elegant text-sm font-light rounded-none"
                        style={{ borderColor: "rgba(197,165,90,0.2)", color: "#2A2A2A" }}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="font-sans-elegant text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: "#999" }}>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field w-full bg-white border px-4 py-3 font-sans-elegant text-sm font-light rounded-none"
                        style={{ borderColor: "rgba(197,165,90,0.2)", color: "#2A2A2A" }}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="font-sans-elegant text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: "#999" }}>Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="input-field w-full bg-white border px-4 py-3 font-sans-elegant text-sm font-light rounded-none resize-none"
                        style={{ borderColor: "rgba(197,165,90,0.2)", color: "#2A2A2A" }}
                        placeholder="Tell us what you're interested in..."
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="cta-btn gold-gradient text-white font-sans-elegant text-xs uppercase tracking-[0.25em] font-medium py-3.5 px-8 rounded-none mt-2"
                    >
                      Send Enquiry
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="aftercare" className="py-24 md:py-32 px-6" style={{ background: "#FDFBF7" }}>
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <SectionLabel text="Aftercare" />
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-4" style={{ color: "#2A2A2A" }}>
              Maintain Your Results
            </h2>
          </Reveal>
          <Reveal delay={250}>
            <GoldDivider />
          </Reveal>
          <Reveal delay={350}>
            <p className="font-sans-elegant text-sm font-light mt-6 mb-14 max-w-md mx-auto" style={{ color: "#888" }}>
              A few simple habits to keep your smile looking its best for as long as possible.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" delay={120}>
            {[
              { num: "01", title: "Avoid Staining", desc: "Limit coffee, tea, red wine and dark-coloured foods for 48 hours after your treatment." },
              { num: "02", title: "Stay Hydrated", desc: "Drink plenty of water to keep your mouth fresh and help wash away surface stains daily." },
              { num: "03", title: "Gentle Brushing", desc: "Use a soft-bristle brush and whitening toothpaste to protect and maintain your shade." },
              { num: "04", title: "Top Up Sessions", desc: "Book a 40-minute maintenance session every few months to keep results looking fresh." },
            ].map((tip, i) => (
              <div key={i} className="aftercare-card border bg-white p-7 text-left" style={{ borderColor: "rgba(197,165,90,0.15)" }}>
                <p className="font-serif text-2xl font-light mb-3" style={{ color: "#C5A55A" }}>{tip.num}</p>
                <h3 className="font-serif text-base font-medium mb-2" style={{ color: "#2A2A2A" }}>{tip.title}</h3>
                <p className="font-sans-elegant text-xs font-light leading-relaxed" style={{ color: "#999" }}>{tip.desc}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 text-center" style={{ background: "#2A2A2A" }}>
        <Reveal>
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-6 text-white">
            Your Confidence Starts With <span className="gold-text italic">One Session</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <a
            href="https://instagram.com/primesmilestudio"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn inline-block gold-gradient text-white font-sans-elegant text-xs uppercase tracking-[0.25em] font-medium px-10 py-4 rounded-none"
          >
            Book On Instagram
          </a>
        </Reveal>
      </section>

      <footer className="py-12 px-6 bg-white" style={{ borderTop: "1px solid rgba(197,165,90,0.15)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-lg font-medium" style={{ color: "#C5A55A" }}>Prime Smile Studio</p>
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/primesmilestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans-elegant text-xs font-light transition-colors duration-300"
              style={{ color: "#999" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#C5A55A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#999"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @primesmilestudio
            </a>
            <span className="font-sans-elegant text-xs font-light" style={{ color: "#ccc" }}>|</span>
            <span className="font-sans-elegant text-xs font-light" style={{ color: "#999" }}>North East, England</span>
          </div>
          <p className="font-sans-elegant text-[10px] font-light tracking-wide" style={{ color: "#ccc" }}>
            © {new Date().getFullYear()} Prime Smile Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useState, type CSSProperties } from "react";

/**
 * Scroll-linked ambient gradients that shift through the eco palette
 * as the visitor moves down the page.
 */
export function ScrollAtmosphere() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      const total =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const next = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      setProgress(next);
      frame = 0;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Blend emerald → teal → deeper green across the scroll journey
  const hueA = 155 + progress * 18;
  const hueB = 168 + progress * 12;
  const glowOpacity = 0.12 + progress * 0.18;
  const orbY = progress * 40;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={
        {
          "--scroll-progress": progress,
          "--hue-a": `${hueA}`,
          "--hue-b": `${hueB}`,
        } as CSSProperties
      }
    >
      <div
        className="scroll-atmosphere-wash absolute inset-0 transition-[opacity] duration-500"
        style={{
          opacity: 0.55 + progress * 0.35,
          background: `
            radial-gradient(ellipse 80% 55% at 15% ${12 + orbY}%, hsla(${hueA}, 70%, 45%, ${glowOpacity}) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 88% ${70 - orbY * 0.6}%, hsla(${hueB}, 65%, 42%, ${glowOpacity * 0.9}) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% ${35 + progress * 30}%, hsla(${160 + progress * 20}, 60%, 50%, ${0.06 + progress * 0.08}) 0%, transparent 60%)
          `,
        }}
      />
      <div
        className="absolute -left-24 top-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl transition-transform duration-700 ease-out"
        style={{
          background: `radial-gradient(circle, hsla(${hueA}, 75%, 48%, 0.22), transparent 70%)`,
          transform: `translate3d(0, ${progress * 120}px, 0) scale(${1 + progress * 0.15})`,
        }}
      />
      <div
        className="absolute -right-20 bottom-1/4 h-[24rem] w-[24rem] rounded-full blur-3xl transition-transform duration-700 ease-out"
        style={{
          background: `radial-gradient(circle, hsla(${hueB}, 70%, 45%, 0.2), transparent 70%)`,
          transform: `translate3d(0, ${-progress * 100}px, 0) scale(${1.05 - progress * 0.1})`,
        }}
      />
    </div>
  );
}

import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function handleScroll() {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      frame = 0;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(handleScroll);
    }

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-emerald-500/10 pointer-events-none">
      <div
        className="h-full scroll-progress-gradient shadow-[0_0_14px_rgba(16,185,129,0.75)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

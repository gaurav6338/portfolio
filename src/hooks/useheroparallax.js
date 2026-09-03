import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Cursor-driven left/right parallax, scoped to a single container.
 * Uses gsap.quickTo() so every mousemove event gets eased toward its
 * target instead of snapping — this is GSAP's built-in lerp.
 *
 * @param {React.RefObject} containerRef - element that owns the mousemove listener
 * @param {React.RefObject} targetRef    - element that gets moved/rotated
 * @param {object} opts
 * @param {number} opts.maxTranslate - max px shift left/right
 * @param {number} opts.maxRotate    - max deg rotation on Y axis
 * @param {boolean} opts.disabled    - turn off entirely (e.g. on touch/mobile)
 */
export function useHeroParallax(
  containerRef,
  targetRef,
  { maxTranslate = 40, maxRotate = 6, disabled = false } = {}
) {
  const quickX = useRef(null);
  const quickRotY = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    // quickTo gives us a pre-built, GPU-friendly tween we can just re-call
    // with new values on every mousemove — this IS the smoothing/easing.
    quickX.current = gsap.quickTo(target, "x", {
      duration: 0.9,
      ease: "power3.out",
    });
    quickRotY.current = gsap.quickTo(target, "rotateY", {
      duration: 0.9,
      ease: "power3.out",
    });

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      // normalize to -1 (left edge) ... 1 (right edge), relative to hero only
      const relX = (e.clientX - rect.left) / rect.width;
      const mouseX = relX * 2 - 1;

      quickX.current(mouseX * maxTranslate);
      quickRotY.current(mouseX * maxRotate);
    };

    const handleLeave = () => {
      quickX.current(0);
      quickRotY.current(0);
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, targetRef, maxTranslate, maxRotate, disabled]);
}
import { useRef, useEffect } from "react";
import styles from "./Overload.module.css";

interface OverloadProps {
  isEnabled: boolean;
  volume: number;
  audioLevel: number;
  disabled: boolean;
}

function Overload({ isEnabled, volume, audioLevel, disabled }: OverloadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match CSS dimensions
    canvas.width = 12;
    canvas.height = 12;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only show indicator if enabled and volume is above 0
    if (isEnabled && volume > 0) {
      // Draw circle with color based on level
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2 - 2,
        0,
        Math.PI * 2
      );

      // Set glow intensity based on audio level
      canvas.style.setProperty("--glow-intensity", audioLevel.toString());

      // Color based on level
      const red = Math.min(255, audioLevel * 255);
      ctx.fillStyle = `rgb(${red}, 0, 0)`;
      ctx.fill();
    } else {
      // Draw dark circle when disabled or volume is 0
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#212121";
      ctx.fill();

      // Remove glow when disabled
      canvas.style.setProperty("--glow-intensity", "0");
    }
  }, [isEnabled, volume, audioLevel]);

  return (
    <div
      className={`${styles.overloadContainer} ${disabled && styles.disabled}`}
    >
      <div className={styles.overloadLabel}>Overload</div>
      <div className={styles.overloadBackground}>
        <canvas ref={canvasRef} className={styles.overload} />
      </div>
    </div>
  );
}

export default Overload;

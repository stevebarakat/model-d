import { getRotation, getDisplayValue } from "./utils";
import { useKnobInteraction } from "./hooks";
import { KnobTicks, KnobLabels } from "./components";
import { KnobProps } from "./types";
import styles from "./Knob.module.css";

/**
 * Knob component with support for both linear and logarithmic scaling.
 *
 * @param logarithmic - When true, applies logarithmic scaling to the knob values.
 *   This is useful for frequency controls, volume controls, and other parameters
 *   where exponential scaling provides better user experience.
 *   Logarithmic scaling works best with positive min/max values.
 *   For non-positive ranges, it falls back to linear scaling.
 */
function Knob({
  value,
  min,
  max,
  step = 1,
  label,
  title = "",
  unit = "",
  onChange,
  valueLabels,
  size = "medium",
  showMidTicks = true,
  type = "radial",
  logarithmic = false,
  style,
}: KnobProps) {
  const { knobRef, handlePointerDown } = useKnobInteraction({
    value,
    min,
    max,
    step,
    type,
    onChange,
    logarithmic,
  });

  const labelClass = title ? styles.labelHidden : styles.label;
  const rotation = getRotation(value, min, max, type, logarithmic);
  const displayValue = getDisplayValue(value, step, unit, valueLabels);
  const ariaValueText =
    typeof displayValue === "string"
      ? displayValue
      : value.toFixed(step >= 1 ? 0 : 2) + (unit ? ` ${unit}` : "");

  return (
    <div
      style={style}
      className={`${styles.knobContainer} ${
        styles[`knobContainer${size.charAt(0).toUpperCase() + size.slice(1)}`]
      }`}
    >
      <label
        className={`${labelClass} ${
          styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`]
        }`}
      >
        {label}
      </label>

      {title && (
        <span
          className={`${styles.title} ${
            styles[`title${size.charAt(0).toUpperCase() + size.slice(1)}`]
          }`}
        >
          {title}
        </span>
      )}

      <div className={styles.knobRing}></div>
      <div className={styles.knob}>
        {/* Tick marks around the knob */}
        {valueLabels && (
          <KnobTicks
            valueLabels={valueLabels}
            min={min}
            max={max}
            type={type}
            showMidTicks={showMidTicks}
            logarithmic={logarithmic}
          />
        )}

        {/* Value labels around the knob */}
        {valueLabels && (
          <KnobLabels
            valueLabels={valueLabels}
            min={min}
            max={max}
            type={type}
            logarithmic={logarithmic}
          />
        )}

        <div
          className={styles.knobBtm}
          style={{
            filter: "drop-shadow(0 -1px 0 hsla(0, 0%, 30%))",
          }}
        >
          <div
            className={type === "arrow" ? styles.arrow : styles.radial}
            ref={knobRef}
            style={{ transform: `rotate(${rotation}deg)` }}
            onPointerDown={handlePointerDown}
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label={label}
            aria-valuetext={ariaValueText}
          >
            <div className={styles.dot} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Knob;

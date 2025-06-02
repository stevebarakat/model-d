import React from "react";

interface PowerButtonProps {
  isOn: boolean;
  onPowerOn: () => void;
  onPowerOff: () => void;
  className?: string;
}

const PowerButton: React.FC<PowerButtonProps> = ({
  isOn,
  onPowerOn,
  onPowerOff,
  className,
}) => {
  return (
    <button
      className={className}
      aria-pressed={isOn}
      aria-label={isOn ? "Power Off" : "Power On"}
      onClick={isOn ? onPowerOff : onPowerOn}
      style={{
        background: isOn ? "#e53935" : "#43a047",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: 48,
        height: 48,
        fontSize: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isOn ? "0 0 8px #e53935" : "0 0 8px #43a047",
        cursor: "pointer",
        outline: "none",
        transition: "background 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Power Icon SVG */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v10" />
        <path d="M6.2 6.2a8 8 0 1 0 11.6 0" />
      </svg>
    </button>
  );
};

export default PowerButton;

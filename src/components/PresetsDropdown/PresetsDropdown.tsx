import React, { useState, useEffect, useRef } from "react";
import { useSynthStore } from "@/store/synthStore";
import { presets, getCategories } from "@/data/presets";
import { copyURLToClipboard } from "@/utils/urlState";
import { getPresetWithURL } from "@/utils/generatePresetURLs";
import { convertPresetToStoreFormat } from "@/utils/presetConversion";
import styles from "./PresetsDropdown.module.css";

const PresetsDropdown: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPreset, setCurrentPreset] = useState<string | null>("Fat Bass");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const loadPreset = useSynthStore((state) => state.loadPreset);
  const synthState = useSynthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = ["All", ...getCategories()];
  const filteredPresets =
    selectedCategory === "All"
      ? presets
      : presets.filter((preset) => preset.category === selectedCategory);

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    const presetParameters = convertPresetToStoreFormat(preset);
    loadPreset(presetParameters);
    setCurrentPreset(preset.name);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFocusedIndex(-1);
  };

  const handleCopyURL = async () => {
    try {
      await copyURLToClipboard(synthState);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL to clipboard:", error);
    }
  };

  const handleCopyPresetURL = async (
    presetId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    try {
      const presetWithURL = getPresetWithURL(presetId);
      if (presetWithURL) {
        await navigator.clipboard.writeText(presetWithURL.shareURL);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy preset URL to clipboard:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredPresets.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredPresets.length - 1
        );
        break;
      case "Enter":
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredPresets.length) {
          handlePresetSelect(filteredPresets[focusedIndex]);
        }
        break;
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.controls}>
        <div className={`${styles.dropdown} ${disabled ? "disabled" : ""}`}>
          <button
            className={styles.trigger}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label="Select a preset"
            disabled={disabled}
          >
            <span className={styles.triggerText}>
              {currentPreset || "Select Preset"}
            </span>
            <svg
              className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <button
          className={styles.urlButton}
          onClick={handleCopyURL}
          disabled={disabled}
          title="Copy current settings as URL"
          aria-label="Copy current settings as URL"
        >
          {showCopiedMessage ? "Copied!" : "Copy URL"}
        </button>
      </div>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          <div className={styles.categoryFilter}>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={styles.categorySelect}
              aria-label="Filter by category"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.presetList}>
            {filteredPresets.map((preset, index) => (
              <div
                key={preset.id}
                className={`${styles.presetItem} ${
                  currentPreset === preset.name ? styles.selected : ""
                } ${focusedIndex === index ? styles.focused : ""}`}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <button
                  className={styles.presetButton}
                  onClick={() => handlePresetSelect(preset)}
                  role="option"
                  aria-selected={currentPreset === preset.name}
                >
                  <div className={styles.presetHeader}>
                    <span className={styles.presetName}>{preset.name}</span>
                    <span className={styles.presetCategory}>
                      {preset.category}
                    </span>
                  </div>
                  <p className={styles.presetDescription}>
                    {preset.description}
                  </p>
                </button>
                <button
                  className={styles.copyUrlButton}
                  onClick={(e) => handleCopyPresetURL(preset.id, e)}
                  title="Copy preset URL"
                  aria-label={`Copy URL for ${preset.name} preset`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H10C10.5523 14 11 13.5523 11 13V11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6H14C14.5523 6 15 6.44772 15 7V13C15 13.5523 14.5523 14 14 14H6C5.44772 14 5 13.5523 5 13V7C5 6.44772 5.44772 6 6 6Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetsDropdown;

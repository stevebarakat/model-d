import { describe, it, expect } from "vitest";
import { getRotation } from "../knobCalculations";

describe("getRotation", () => {
  describe("attackDecay type", () => {
    it("should calculate rotation based on knob position range (0-10000)", () => {
      // Test that rotation is linear with respect to knob position
      const min = 0;
      const max = 10000;

      // At position 0, should be at minimum rotation
      const rotation0 = getRotation(0, min, max, "attackDecay");
      expect(rotation0).toBe(-145); // -145 degrees for radial knobs

      // At position 5000 (middle), should be at center rotation
      const rotation5000 = getRotation(5000, min, max, "attackDecay");
      expect(rotation5000).toBe(0); // 0 degrees for radial knobs

      // At position 10000, should be at maximum rotation
      const rotation10000 = getRotation(10000, min, max, "attackDecay");
      expect(rotation10000).toBe(145); // 145 degrees for radial knobs
    });

    it("should handle intermediate positions correctly", () => {
      const min = 0;
      const max = 10000;

      // Test a few intermediate positions to ensure smooth rotation
      const rotation2500 = getRotation(2500, min, max, "attackDecay");
      const rotation7500 = getRotation(7500, min, max, "attackDecay");

      // Should be between -145 and 0 for 2500
      expect(rotation2500).toBeGreaterThan(-145);
      expect(rotation2500).toBeLessThan(0);

      // Should be between 0 and 145 for 7500
      expect(rotation7500).toBeGreaterThan(0);
      expect(rotation7500).toBeLessThan(145);
    });
  });

  describe("other types", () => {
    it("should handle radial type with linear scaling", () => {
      const rotation = getRotation(50, 0, 100, "radial");
      expect(rotation).toBe(0); // 50% should be 0 degrees
    });

    it("should handle arrow type", () => {
      const rotation = getRotation(50, 0, 100, "arrow");
      expect(rotation).toBe(0); // 50% should be 0 degrees for arrow
    });
  });
});

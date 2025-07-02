import { useEffect, useRef } from "react";
import { useSynthStore } from "@/store/synthStore";
import { updateURLWithState } from "@/utils/urlState";

// Global flag to track if we're currently loading from URL
let isLoadingFromURL = false;

export function setLoadingFromURL(loading: boolean) {
  isLoadingFromURL = loading;
}

export function useURLSync() {
  const synthState = useSynthStore();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Skip the first render
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      // Add a small delay to ensure URL loading has happened
      setTimeout(() => {
        // Only update URL if we're not loading from URL and there are no URL params
        if (!isLoadingFromURL) {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.toString() === "") {
            updateURLWithState(synthState);
          }
        }
      }, 100);
      return;
    }

    // Don't update URL if we're currently loading from URL
    if (!isLoadingFromURL) {
      updateURLWithState(synthState);
    }
  }, [synthState]);
}

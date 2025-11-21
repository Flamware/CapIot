import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 1100) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Listen for changes
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [breakpoint]);

    return isMobile;
}

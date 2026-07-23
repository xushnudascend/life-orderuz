import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type OpenOpts = { contextHint?: string; seed?: string };

type NadirContextValue = {
  isOpen: boolean;
  contextHint?: string;
  seed?: string;
  open: (opts?: OpenOpts) => void;
  close: () => void;
  clearSeed: () => void;
};

const NadirContext = createContext<NadirContextValue | null>(null);

export function NadirProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contextHint, setContextHint] = useState<string | undefined>();
  const [seed, setSeed] = useState<string | undefined>();

  const open = useCallback((opts?: OpenOpts) => {
    if (opts?.contextHint !== undefined) setContextHint(opts.contextHint);
    if (opts?.seed !== undefined) setSeed(opts.seed);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const clearSeed = useCallback(() => setSeed(undefined), []);

  const value = useMemo(
    () => ({ isOpen, contextHint, seed, open, close, clearSeed }),
    [isOpen, contextHint, seed, open, close, clearSeed],
  );
  return <NadirContext.Provider value={value}>{children}</NadirContext.Provider>;
}

export function useNadir() {
  const ctx = useContext(NadirContext);
  if (!ctx) {
    // Graceful fallback — makes callers safe even if provider not mounted (e.g. public routes).
    return {
      isOpen: false,
      contextHint: undefined,
      seed: undefined,
      open: () => {},
      close: () => {},
      clearSeed: () => {},
    } as NadirContextValue;
  }
  return ctx;
}

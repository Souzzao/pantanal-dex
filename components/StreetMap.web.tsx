import { useI18n } from '@/contexts/LanguageContext';
import { createElement, useCallback, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";

import { LEAFLET_CSS, LEAFLET_JS } from "@/shared/leaflet-assets";
import { buildStreetMapHtml, parseStreetMapEvent, serializeState } from "@/shared/street-map";
import type { StreetMapProps } from "./StreetMap";

let cachedHtml: string | null = null;
const pageHtml = () => (cachedHtml ??= buildStreetMapHtml({ js: LEAFLET_JS, css: LEAFLET_CSS }));

/** Mesma página do mapa num iframe (web). */
export function StreetMap({ state, onEvent, style, accessibilityLabel }: StreetMapProps) {
  const { locale } = useI18n();
  const frame = useRef<HTMLIFrameElement | null>(null);
  const ready = useRef(false);
  const serialized = useMemo(() => serializeState(state, locale), [state, locale]);
  const latest = useRef(serialized);
  latest.current = serialized;

  const push = useCallback((json: string) => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ target: "pantanal-dex-map", state: json }), "*");
  }, []);

  useEffect(() => {
    if (ready.current) push(serialized);
  }, [serialized, push]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const parsed = parseStreetMapEvent(event.data);
      if (!parsed) return;
      if (parsed.type === "ready") {
        ready.current = true;
        push(latest.current);
      }
      onEvent(parsed);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [onEvent, push]);

  return (
    <View style={[{ flex: 1, overflow: "hidden" }, style]} accessibilityLabel={accessibilityLabel}>
      {createElement("iframe", {
        ref: frame,
        srcDoc: pageHtml(),
        title: accessibilityLabel ?? "Mapa",
        sandbox: "allow-scripts allow-popups",
        style: { border: 0, width: "100%", height: "100%", flex: 1 },
      })}
    </View>
  );
}

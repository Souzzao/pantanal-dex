import { useCallback, useEffect, useMemo, useRef } from "react";
import { Linking, View, type StyleProp, type ViewStyle } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { LEAFLET_CSS, LEAFLET_JS } from "@/shared/leaflet-assets";
import { buildStreetMapHtml, parseStreetMapEvent, serializeState, type StreetMapEvent, type StreetMapState } from "@/shared/street-map";

export type StreetMapProps = {
  state: StreetMapState;
  onEvent: (event: StreetMapEvent) => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

// Montado uma vez: o HTML não muda; os dados vão por mensagem.
let cachedHtml: string | null = null;
const pageHtml = () => (cachedHtml ??= buildStreetMapHtml({ js: LEAFLET_JS, css: LEAFLET_CSS }));

/** Mapa de ruas (OpenStreetMap via Leaflet) numa WebView. Android/iOS. */
export function StreetMap({ state, onEvent, style, accessibilityLabel }: StreetMapProps) {
  const ref = useRef<WebView>(null);
  const ready = useRef(false);
  const serialized = useMemo(() => serializeState(state), [state]);
  const latest = useRef(serialized);
  latest.current = serialized;

  const push = useCallback((json: string) => {
    // JSON é seguro como literal de JavaScript; o parse acontece dentro da página.
    ref.current?.injectJavaScript(`window.__pantanalSetState && window.__pantanalSetState(${JSON.stringify(json)}); true;`);
  }, []);

  useEffect(() => {
    if (ready.current) push(serialized);
  }, [serialized, push]);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const parsed = parseStreetMapEvent(event.nativeEvent.data);
    if (!parsed) return;
    if (parsed.type === "ready") {
      ready.current = true;
      push(latest.current);
    }
    onEvent(parsed);
  }, [onEvent, push]);

  return (
    <View style={[{ flex: 1, overflow: "hidden" }, style]} accessibilityLabel={accessibilityLabel}>
      <WebView
        ref={ref}
        originWhitelist={["*"]}
        // Referer identificando o projeto (política de uso dos servidores de mapa do OpenStreetMap).
        source={{ html: pageHtml(), baseUrl: "https://github.com/Souzzao/pantanal-dex" }}
        onMessage={onMessage}
        onLoadStart={() => { ready.current = false; }}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        // Links do crédito do mapa abrem fora do app, nunca dentro da WebView.
        onShouldStartLoadWithRequest={(request) => {
          const internal = request.url.startsWith("about:") || request.url.startsWith("data:") || request.url.startsWith("https://github.com/Souzzao/pantanal-dex");
          if (!internal && request.url.startsWith("https://")) void Linking.openURL(request.url).catch(() => undefined);
          return internal;
        }}
        style={{ flex: 1, backgroundColor: "#e8eef0" }}
      />
    </View>
  );
}

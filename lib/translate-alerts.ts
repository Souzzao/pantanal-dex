import { Alert, type AlertButton, type AlertOptions } from "react-native";

import { tr } from "@/shared/i18n";

let installed = false;

/** Faz os avisos (Alert) saírem no idioma escolhido, com as mesmas traduções embutidas das telas. */
export function installAlertTranslation(): void {
  if (installed) return;
  installed = true;
  const original = Alert.alert.bind(Alert);
  Alert.alert = (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) =>
    original(tr(title), message ? tr(message) : message, buttons?.map((button) => (button.text ? { ...button, text: tr(button.text) } : button)), options);
}

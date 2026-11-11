import React from "react";
import { Text as NativeText, TextInput as NativeTextInput, type TextInputProps, type TextProps } from "react-native";

import { getLanguageCode, tr } from "@/shared/i18n";

/**
 * `Text` e `TextInput` que traduzem o texto em português para o idioma escolhido em Ajustes.
 * As traduções ficam em shared/i18n (dentro do app, funcionam sem internet). Texto sem tradução
 * aparece como foi escrito.
 */
function translateChildren(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") return tr(children);
  if (!Array.isArray(children)) return children;
  if (children.every((child) => typeof child === "string" || typeof child === "number")) return tr(children.join(""));
  return children.map((child) => (typeof child === "string" ? tr(child) : child));
}

export const Text = React.forwardRef<NativeText, TextProps>(function Text({ children, ...rest }, ref) {
  return <NativeText ref={ref} {...rest}>{getLanguageCode() === "pt" ? children : translateChildren(children)}</NativeText>;
});

export const TextInput = React.forwardRef<NativeTextInput, TextInputProps>(function TextInput({ placeholder, ...rest }, ref) {
  return <NativeTextInput ref={ref} placeholder={placeholder ? tr(placeholder) : placeholder} {...rest} />;
});

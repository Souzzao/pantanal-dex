/**
 * PantanalDex — Text e TextInput com a fonte e as cores do tema aplicadas por padrão.
 *
 * @author Felipe de Souza Aquino
 */
import React from "react";
import { Text as NativeText, TextInput as NativeTextInput, type TextInputProps, type TextProps } from "react-native";

import { getLanguageCode, tr } from "@/shared/i18n";

/**
 * Idioma atual, fornecido pelo LanguageScope (app/_layout). Os textos assinam este contexto e se
 * redesenham sozinhos quando o idioma muda, sem remontar a navegação inteira (remontar o navegador
 * no meio de uma tela, como a ficha do animal, derrubava o app no Android).
 */
export const LanguageContext = React.createContext<string>("Português");

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
  React.useContext(LanguageContext); // assina a troca de idioma
  return <NativeText ref={ref} {...rest}>{getLanguageCode() === "pt" ? children : translateChildren(children)}</NativeText>;
});

export const TextInput = React.forwardRef<NativeTextInput, TextInputProps>(function TextInput({ placeholder, ...rest }, ref) {
  React.useContext(LanguageContext);
  return <NativeTextInput ref={ref} placeholder={placeholder ? tr(placeholder) : placeholder} {...rest} />;
});

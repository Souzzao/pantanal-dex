import React, { forwardRef } from 'react';
import { Text as NativeText, TextInput as NativeTextInput, Pressable as NativePressable, Alert as NativeAlert, type TextProps, type TextInputProps, type PressableProps } from 'react-native';
import { useI18n } from '@/contexts/LanguageContext';
import { translateUi } from '@/shared/i18n';

function translateChildren(children: React.ReactNode, t: (text: string) => string): React.ReactNode {
  if (typeof children === 'string') return t(children);
  if (Array.isArray(children)) {
    if (children.every(child => typeof child === 'string' || typeof child === 'number')) {
      const joined = children.join('');
      const translated = t(joined);
      return translated !== joined ? translated : children.map(child => typeof child === 'string' ? t(child) : child);
    }
    return children.map(child => typeof child === 'string' ? t(child) : child);
  }
  return children;
}
export const Text = forwardRef<NativeText, TextProps>(function Text({ children, accessibilityLabel, accessibilityHint, ...props }, ref) {
  const { t } = useI18n();
  return <NativeText {...props} ref={ref} accessibilityLabel={accessibilityLabel ? t(accessibilityLabel) : undefined} accessibilityHint={accessibilityHint ? t(accessibilityHint) : undefined}>{translateChildren(children, t)}</NativeText>;
});
export const TextInput = forwardRef<NativeTextInput, TextInputProps>(function TextInput({ placeholder, accessibilityLabel, accessibilityHint, ...props }, ref) {
  const { t } = useI18n();
  return <NativeTextInput {...props} ref={ref} placeholder={placeholder ? t(placeholder) : undefined} accessibilityLabel={accessibilityLabel ? t(accessibilityLabel) : undefined} accessibilityHint={accessibilityHint ? t(accessibilityHint) : undefined} />;
});
export const Pressable = forwardRef<React.ElementRef<typeof NativePressable>, PressableProps>(function Pressable({ accessibilityLabel, accessibilityHint, ...props }, ref) {
  const { t } = useI18n();
  return <NativePressable {...props} ref={ref} accessibilityLabel={accessibilityLabel ? t(accessibilityLabel) : undefined} accessibilityHint={accessibilityHint ? t(accessibilityHint) : undefined} />;
});
export const Alert: typeof NativeAlert = {
  ...NativeAlert,
  alert: (title, message, buttons, options) => NativeAlert.alert(translateUi(title), message ? translateUi(message) : message, buttons?.map(button => ({ ...button, text: button.text ? translateUi(button.text) : button.text })), options),
};

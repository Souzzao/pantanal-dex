/**
 * PantanalDex — Aba Registrar: atalho que leva direto ao formulário de novo avistamento.
 *
 * @author Felipe de Souza Aquino
 */
import { Redirect } from "expo-router";

/**
 * Aba "Registrar": o toque na aba abre o formulário (ver app/(tabs)/_layout.tsx).
 * Se alguém chegar aqui por link, vai direto para o formulário.
 */
export default function RegisterTab() {
  return <Redirect href={"/sightings/new" as never} />;
}

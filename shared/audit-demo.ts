/**
 * PantanalDex — Modo demonstração da auditoria: gera uma pilha de registros públicos simulados e
 * simula, passo a passo, as verificações que o servidor faz quando alguém publica um avistamento.
 * Nada é enviado ao Supabase; serve para apresentar e testar o processo.
 *
 * As verificações usam as mesmas regras do app: data não futura, ponto dentro do Pantanal e limite
 * de 30 publicações por dia.
 *
 * @author Felipe de Souza Aquino
 */
import type { AuditItem } from "./audit";
import { isInsidePantanal } from "./pantanal-boundary";
import { getLocalTodayISODate, isValidSightingDate } from "./pantanal";
import { DAILY_SIGHTING_CREATION_LIMIT } from "./sighting-rules";

export const DEMO_PREFIX = "demo-";

/** Etapas do processo, na ordem em que acontecem. */
export const AUDIT_PROCESS = [
  { icon: "📷", title: "Registro", text: "A pessoa salva o avistamento no caderno e escolhe publicar." },
  { icon: "🛡️", title: "Servidor confere", text: "Conta, data, ponto no Pantanal e limite de 30 por dia." },
  { icon: "⏳", title: "Pendente", text: "O registro entra na pilha da auditoria. Ainda não aparece no mapa." },
  { icon: "🔎", title: "Auditor decide", text: "Compara a foto com o catálogo e aprova, corrige a espécie ou recusa." },
  { icon: "🗺️", title: "Mapa público", text: "Aprovado: aparece como área aproximada, nunca o ponto exato." },
] as const;

const PEOPLE = ["Ana Lima", "João Pereira", "Marina Costa", "Guia Rafael", "Turma 3º ano", "Pedro Alves"];

type DemoSeed = { speciesId: string; lat: number; lon: number; notes: string; daysAgo: number; time: string };
const SEEDS: DemoSeed[] = [
  { speciesId: "tuiuiu", lat: -16.4085, lon: -56.4361, notes: "Ninho grande no alto do piúval, dois adultos.", daysAgo: 0, time: "07:12" },
  { speciesId: "onca-pintada", lat: -17.3561, lon: -56.7710, notes: "Vista do barco, atravessando o rio.", daysAgo: 1, time: "16:40" },
  { speciesId: "capivara", lat: -16.0712, lon: -57.6905, notes: "Acho que é uma anta filhote.", daysAgo: 1, time: "18:02" },
  { speciesId: "arara-azul", lat: -19.5702, lon: -56.2391, notes: "Bando de cinco no acuri.", daysAgo: 2, time: "08:55" },
  { speciesId: "jacare-do-pantanal", lat: -16.5512, lon: -56.7340, notes: "Foto tirada de longe, ficou escura.", daysAgo: 3, time: "14:20" },
];

const isoDay = (now: Date, daysAgo: number) => {
  const d = new Date(now.getTime() - daysAgo * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Pilha simulada de registros pendentes. */
export function createDemoQueue(now: Date = new Date()): AuditItem[] {
  return SEEDS.map((seed, index) => ({
    id: `${DEMO_PREFIX}${index + 1}`,
    speciesId: seed.speciesId,
    observedOn: isoDay(now, seed.daysAgo),
    observedTime: seed.time,
    exactLat: seed.lat,
    exactLon: seed.lon,
    notes: seed.notes,
    photoPath: null,
    publishedAt: new Date(now.getTime() - (index + 1) * 3600000).toISOString(),
    ownerName: PEOPLE[index % PEOPLE.length],
  }));
}

export type PublishCheck = { label: string; ok: boolean; detail: string };
export type PublishSimulation = { checks: PublishCheck[]; accepted: boolean; item: AuditItem | null };

/**
 * Simula a publicação de um avistamento passando pelas verificações do servidor.
 * @param input Espécie, data, coordenadas e quantas publicações a pessoa já fez hoje.
 */
export function simulatePublication(
  input: { speciesId: string; observedOn: string; lat: number; lon: number; publishedToday: number; signedIn: boolean; notes?: string; ownerName?: string },
  now: Date = new Date(),
  sequence = 1,
): PublishSimulation {
  const checks: PublishCheck[] = [
    { label: "Conta conectada", ok: input.signedIn, detail: input.signedIn ? "Sessão válida no servidor." : "É preciso entrar na conta para publicar." },
    { label: "Data válida", ok: isValidSightingDate(input.observedOn), detail: input.observedOn > getLocalTodayISODate() ? "A data está no futuro." : "A data não é futura." },
    { label: "Dentro do Pantanal", ok: isInsidePantanal(input.lat, input.lon), detail: isInsidePantanal(input.lat, input.lon) ? "O ponto está no contorno oficial do bioma." : "O ponto está fora do Pantanal." },
    { label: "Limite diário", ok: input.publishedToday < DAILY_SIGHTING_CREATION_LIMIT, detail: `${input.publishedToday}/${DAILY_SIGHTING_CREATION_LIMIT} publicações hoje.` },
  ];
  const accepted = checks.every((check) => check.ok);
  const item: AuditItem | null = accepted
    ? {
        id: `${DEMO_PREFIX}sim-${sequence}-${now.getTime().toString(36)}`,
        speciesId: input.speciesId,
        observedOn: input.observedOn,
        observedTime: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        exactLat: input.lat,
        exactLon: input.lon,
        notes: input.notes ?? "Publicação simulada no modo demonstração.",
        photoPath: null,
        publishedAt: now.toISOString(),
        ownerName: input.ownerName ?? "Você (simulação)",
      }
    : null;
  return { checks, accepted, item };
}

/** Dois cenários prontos para a demonstração: um aceito e um recusado (ponto fora do Pantanal). */
export function demoScenario(kind: "valid" | "invalid", speciesId: string, now: Date = new Date()) {
  return kind === "valid"
    ? { speciesId, observedOn: isoDay(now, 0), lat: -16.43, lon: -56.88, publishedToday: 3, signedIn: true }
    : { speciesId, observedOn: isoDay(now, 0), lat: -23.55, lon: -46.63, publishedToday: 3, signedIn: true, notes: "Registro em São Paulo (fora do bioma)." };
}

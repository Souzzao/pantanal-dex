import { describe, expect, it } from "vitest";

import { normalizeAuditRow, normalizeLogRow, REJECT_REASONS } from "../shared/audit";
import { authErrorKey, canAudit, isDev, restoreAccount, validateSignUp, type Account } from "../shared/auth";

const account = (role: Account["role"]): Account => ({ id: "u1", email: "a@b.co", displayName: "Ana", role });

describe("conta guardada para o modo offline", () => {
  it("restaura a conta válida e ignora lixo", () => {
    expect(restoreAccount(JSON.stringify(account("auditor")))).toEqual(account("auditor"));
    expect(restoreAccount(JSON.stringify({ ...account("user"), role: "admin" }))).toBeNull();
    expect(restoreAccount("{quebrado")).toBeNull();
    expect(restoreAccount(null)).toBeNull();
  });
});

describe("papéis", () => {
  it("auditor e dev auditam; só dev entra na área dev", () => {
    expect([canAudit(account("user")), canAudit(account("auditor")), canAudit(account("dev")), canAudit(null)]).toEqual([false, true, true, false]);
    expect([isDev(account("auditor")), isDev(account("dev"))]).toEqual([false, true]);
  });
});

describe("cadastro", () => {
  it("confere e-mail, senha e nome", () => {
    expect(validateSignUp({ email: "ana@x.com", password: "12345678", displayName: "Ana" })).toBeNull();
    expect(validateSignUp({ email: "ana", password: "12345678", displayName: "Ana" })).toBe("email");
    expect(validateSignUp({ email: "ana@x.com", password: "123", displayName: "Ana" })).toBe("password");
    expect(validateSignUp({ email: "ana@x.com", password: "12345678", displayName: " A " })).toBe("name");
  });

  it("traduz os erros do servidor", () => {
    expect(authErrorKey("Invalid login credentials")).toBe("invalid");
    expect(authErrorKey("User already registered")).toBe("exists");
    expect(authErrorKey("Email not confirmed")).toBe("confirm");
    expect(authErrorKey("Failed to fetch")).toBe("network");
    expect(authErrorKey("algo estranho")).toBe("unknown");
  });
});


describe("auditoria", () => {
  it("lê a pilha e descarta linhas sem coordenada", () => {
    expect(normalizeAuditRow({ id: "x", species_id: "tuiuiu", observed_on: "2026-11-06", observed_time: null, exact_lat: -16.43, exact_lon: -56.87, notes: "perto do rio", photo_path: "u/x.jpg", published_at: "2026-11-07T10:00:00Z", owner_name: "Ana" }))
      .toMatchObject({ id: "x", exactLat: -16.43, photoPath: "u/x.jpg", ownerName: "Ana" });
    expect(normalizeAuditRow({ id: "x", species_id: "tuiuiu", observed_on: "2026-11-06", exact_lat: null })).toBeNull();
  });

  it("lê o histórico só com decisões válidas", () => {
    expect(normalizeLogRow({ sighting_id: "x", decision: "rejected", note: "foto ruim", created_at: "t", auditor_name: "B" })).toMatchObject({ decision: "rejected", note: "foto ruim" });
    expect(normalizeLogRow({ sighting_id: "x", decision: "talvez" })).toBeNull();
  });

  it("tem motivos rápidos nos três idiomas", () => {
    expect(REJECT_REASONS.pt).toHaveLength(REJECT_REASONS.en.length);
    expect(REJECT_REASONS.es).toHaveLength(REJECT_REASONS.en.length);
  });
});

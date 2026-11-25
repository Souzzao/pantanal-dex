import { describe, expect, it } from "vitest";
import { oauthErrorMessage, parseOAuthCallback } from "../shared/oauth";

describe("login social", () => {
  it("lê code do fluxo PKCE", () => expect(parseOAuthCallback("pantanaldex://auth-callback?code=abc123")).toEqual({ kind: "code", code: "abc123" }));
  it("lê tokens do fragmento", () => expect(parseOAuthCallback("pantanaldex://auth-callback#access_token=a&refresh_token=r&expires_in=3600")).toEqual({ kind: "tokens", accessToken: "a", refreshToken: "r" }));
  it("lê erro", () => expect(parseOAuthCallback("pantanaldex://auth-callback?error=access_denied&error_description=User%20cancelled")).toEqual({ kind: "error", message: "User cancelled" }));
  it("sem nada", () => expect(parseOAuthCallback("pantanaldex://auth-callback")).toEqual({ kind: "none" }));
  it("provedor desligado vira mensagem clara", () => expect(oauthErrorMessage("Unsupported provider: provider is not enabled")).toMatch(/ainda não foi ativado/));
});

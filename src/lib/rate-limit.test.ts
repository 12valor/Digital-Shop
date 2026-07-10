import { afterEach, describe, expect, it } from "vitest";

import { clearRateLimitsForTest, consumeRateLimit } from "@/lib/rate-limit";

describe("rate limiting", () => {
  afterEach(() => {
    clearRateLimitsForTest();
  });

  it("allows requests until the configured limit is reached", () => {
    const config = { limit: 2, windowMs: 60_000 };

    expect(consumeRateLimit("login:user@example.com", config, 1000).allowed).toBe(true);
    expect(consumeRateLimit("login:user@example.com", config, 2000).allowed).toBe(true);
    expect(consumeRateLimit("login:user@example.com", config, 3000).allowed).toBe(false);
  });

  it("resets after the window expires", () => {
    const config = { limit: 1, windowMs: 10_000 };

    expect(consumeRateLimit("proof:user-id", config, 1000).allowed).toBe(true);
    expect(consumeRateLimit("proof:user-id", config, 2000).allowed).toBe(false);
    expect(consumeRateLimit("proof:user-id", config, 12_000).allowed).toBe(true);
  });
});

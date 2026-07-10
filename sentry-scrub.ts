import type { ErrorEvent } from "@sentry/core";

const sensitiveKeyPattern =
  /password|token|secret|authorization|cookie|receipt|screenshot|gcash|reference|mobile|phone|amount/i;

function scrubValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(scrubValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        sensitiveKeyPattern.test(key) ? "[Filtered]" : scrubValue(nested),
      ]),
    );
  }

  return value;
}

export function scrubSentryEvent(event: ErrorEvent): ErrorEvent {
  if (event.request?.cookies) {
    delete event.request.cookies;
  }

  if (event.request?.headers) {
    event.request.headers = scrubValue(event.request.headers) as Record<string, string>;
  }

  if (event.contexts) {
    event.contexts = scrubValue(event.contexts) as ErrorEvent["contexts"];
  }

  if (event.extra) {
    event.extra = scrubValue(event.extra) as ErrorEvent["extra"];
  }

  if (event.user) {
    event.user = {
      id: event.user.id,
      role: event.user.role,
    };
  }

  return event;
}

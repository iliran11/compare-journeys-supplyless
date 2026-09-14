// Server-side fetch that retries on transient upstream failures (429 / 5xx / network errors).
// Returns the final Response; the caller decides how to handle a non-ok status.
const RETRYABLE_STATUSES = [408, 425, 429, 500, 502, 503, 504];

export default async function fetchWithRetry(url, options, retries = 3, baseDelayMs = 700) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || !RETRYABLE_STATUSES.includes(res.status) || attempt === retries) return res;
      lastError = new Error('HTTP ' + res.status);
    } catch (err) {
      lastError = err;
      if (attempt === retries) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, attempt)));
  }
  throw lastError;
}

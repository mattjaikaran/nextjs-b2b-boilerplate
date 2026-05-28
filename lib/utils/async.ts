export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryAttempt<T>(
  fn: () => Promise<T>,
  attempt: number,
  maxAttempts: number,
  delay: number
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempt >= maxAttempts) {
      throw error;
    }
    await sleep(delay * attempt);
    return retryAttempt(fn, attempt + 1, maxAttempts, delay);
  }
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delay?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000 } = options;
  return retryAttempt(fn, 1, maxAttempts, delay);
}

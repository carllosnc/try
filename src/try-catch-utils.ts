export function tryCatch<T>(action: () => T) {
  let currentError: Error | null = null
  let data = null

  try {
    data = action()
  } catch (e: unknown) {
    if (e instanceof Error) {
      currentError = e
    } else {
      currentError = new Error('Unknown error')
    }
  }

  return {
    data,
    isError: currentError instanceof Error,
    error: {
      message: currentError?.message || null,
      stack: currentError?.stack || null,
      name: currentError?.name || null,
      cause: currentError?.cause || null,
    },
  }
}

export async function tryCatchAsync<T>(action: () => Promise<T>) {
  let currentError: Error | null = null
  let data: T | null = null

  try {
    data = await action()
  } catch (e: unknown) {
    if (e instanceof Error) {
      currentError = e
    } else {
      currentError = new Error('Unknown error')
    }
  }

  return {
    data,
    isError: currentError instanceof Error,
    error: {
      message: currentError?.message || null,
      stack: currentError?.stack || null,
      name: currentError?.name || null,
      cause: currentError?.cause || null,
    },
  }
}
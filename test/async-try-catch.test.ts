import { describe, test, expect } from 'bun:test'
import { tryCatchAsync } from '../src/async-try-catch'

describe('tryCatchAsync function', () => {
  test('should handle successful async operations', async () => {
    const expectedData = { success: true, data: [1, 2, 3] }

    const result = await tryCatchAsync(async () => {
      return Promise.resolve(expectedData)
    })

    expect(result.data).toEqual(expectedData)
    expect(result.isError).toBe(false)
    expect(result.error.message).toBeNull()
    expect(result.error.stack).toBeNull()
    expect(result.error.name).toBeNull()
    expect(result.error.cause).toBeNull()
  })

  test('should handle async errors correctly', async () => {
    const errorMessage = 'Network error'

    const result = await tryCatchAsync(async () => {
      throw new Error(errorMessage)
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe(errorMessage)
    expect(result.error.stack).toBeDefined()
    expect(result.error.name).toBe('Error')
  })

  test('should handle rejected promises', async () => {
    const errorMessage = 'Promise rejected'

    const result = await tryCatchAsync(async () => {
      return Promise.reject(new Error(errorMessage))
    })
    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe(errorMessage)
  })

  test('should handle non-Error rejections', async () => {
    const result = await tryCatchAsync(async () => {
      return Promise.reject('Just a string rejection')
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe('Unknown error')
  })

  test('should handle async errors with cause', async () => {
    const cause = new Error('Root cause')

    const result = await tryCatchAsync(async () => {
      throw new Error('Main error', { cause })
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe('Main error')
    expect(result.error.cause).toBe(cause)
  })

  test('should handle delayed async operations', async () => {
    const delayedData = { delayed: true }

    const result = await tryCatchAsync(async () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(delayedData), 100)
      })
    })

    expect(result.data).toEqual(delayedData)
    expect(result.isError).toBe(false)
  })

  test('should handle nested async operations', async () => {
    const result = await tryCatchAsync(async () => {
      const innerResult = await tryCatchAsync(async () => {
        return 'inner success'
      })

      if (innerResult.isError) {
        throw new Error('Inner operation failed')
      }

      return `Outer success with: ${innerResult.data}`
    })

    expect(result.data).toBe('Outer success with: inner success')
    expect(result.isError).toBe(false)
  })

  test('should handle fetch API errors', async () => {
    const result = await tryCatchAsync(async () => {
      const response = await fetch('https://api.example.com/data')
      return response.json()
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
  })

  test('should handle async functions that return null or undefined', async () => {
    const nullResult = await tryCatchAsync(async () => {
      return null
    })

    expect(nullResult.data).toBeNull()
    expect(nullResult.isError).toBe(false)

    const undefinedResult = await tryCatchAsync(async () => {
      return undefined
    })

    expect(undefinedResult.data).toBeUndefined()
    expect(undefinedResult.isError).toBe(false)
  })

  test('should maintain the error stack trace', async () => {
    const result = await tryCatchAsync(async () => {
      const nestedAsyncFunction = async () => {
        throw new Error('Deep async error')
      }

      return await nestedAsyncFunction()
    })

    expect(result.isError).toBe(true)
    expect(result.error.stack).toContain('Deep async error')
  })
})
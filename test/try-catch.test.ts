import { tryCatch } from '../src/try-catch-utils'
import { describe, test, expect } from 'bun:test'

describe('tryCatch function', () => {
  test('should return data when action succeeds', () => {
    const expectedResult = { success: true }

    const result = tryCatch(() => expectedResult)

    expect(result.data).toEqual(expectedResult)

    expect(result.isError).toBe(false)
    expect(result.error.message).toBeNull()
    expect(result.error.stack).toBeNull()
    expect(result.error.name).toBeNull()
    expect(result.error.cause).toBeNull()
  })

  test('should handle standard Error objects correctly', () => {
    const errorMessage = 'Test error message'

    const result = tryCatch(() => {
      throw new Error(errorMessage)
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe(errorMessage)
    expect(result.error.stack).toContain('Error: Test error message')
    expect(result.error.name).toBe('Error')
  })

  test('should handle custom Error classes', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message)
        this.name = 'CustomError'
      }
    }

    const result = tryCatch(() => {
      throw new CustomError('Custom error occurred')
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe('Custom error occurred')
    expect(result.error.name).toBe('CustomError')
  })

  test('should handle errors with cause property', () => {
    const cause = new Error('Root cause')

    const result = tryCatch(() => {
      throw new Error('Top level error', { cause })
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe('Top level error')
    expect(result.error.cause).toBe(cause)
  })

  test('should convert non-Error thrown values to Error objects', () => {
    const result = tryCatch(() => {
      throw 'Just a string error'
    })

    expect(result.data).toBeNull()
    expect(result.isError).toBe(true)
    expect(result.error.message).toBe('Unknown error')
    expect(result.error.name).toBe('Error')
  })

  test('should handle null or undefined return values correctly', () => {
    const nullResult = tryCatch(() => null)
    expect(nullResult.data).toBeNull()
    expect(nullResult.isError).toBe(false)

    const undefinedResult = tryCatch(() => undefined)
    expect(undefinedResult.data).toBeUndefined()
    expect(undefinedResult.isError).toBe(false)
  })

  test('should handle actions that return functions', () => {
    const testFunction = () => 'function result'

    const result = tryCatch(() => testFunction)

    expect(typeof result.data).toBe('function')
    expect(result.data!()).toBe('function result')
    expect(result.isError).toBe(false)
  })

  test('should have proper stack trace in error objects', () => {
    const result = tryCatch(() => {
      const nestedFunction = () => {
        throw new Error('Deep error')
      }

      return nestedFunction()
    })

    expect(result.isError).toBe(true)
    expect(result.error.stack).toContain('Deep error')
  })
})
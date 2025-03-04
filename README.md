# try-catch-utils

A lightweight TypeScript utility package providing simple, consistent error handling for synchronous and asynchronous operations.

## Features

- Unified error handling for both synchronous and asynchronous operations
- Type safety with TypeScript generics
- Standardized error object structure
- Handles both Error instances and unknown error types
- Zero dependencies

## Usage

### Synchronous Operations

```typescript
import { tryCatch } from 'try-catch-utils';

// Example with successful operation
const { data, isError, error } = tryCatch(() => {
  return "Operation successful";
});

console.log(data); // "Operation successful"
console.log(isError); // false

// Example with error
const result = tryCatch(() => {
  throw new Error("Something went wrong");
});

if (result.isError) {
  console.log(result.error.message); // "Something went wrong"
  console.log(result.error.name); // "Error"
  // Stack trace and cause are also available if present
}
```

### Asynchronous Operations

```typescript
import { tryCatchAsync } from 'try-catch-utils';

// Example with successful async operation
const fetchData = async () => {
  const result = await tryCatchAsync(async () => {
    // Simulate API call
    return { id: 1, name: "Example" };
  });

  if (!result.isError) {
    console.log(result.data); // { id: 1, name: "Example" }
  }

  return result;
};

// Example with error in async operation
const fetchWithError = async () => {
  const result = await tryCatchAsync(async () => {
    throw new Error("API request failed");
  });

  if (result.isError) {
    console.log(result.error.message); // "API request failed"
  }

  return result;
};
```

## API Reference

### tryCatch

```typescript
function tryCatch<T>(action: () => T): {
  data: T | null;
  isError: boolean;
  error: {
    message: string | null;
    stack: string | null;
    name: string | null;
    cause: unknown | null;
  };
}
```

### tryCatchAsync

```typescript
async function tryCatchAsync<T>(action: () => Promise<T>): Promise<{
  data: T | null;
  isError: boolean;
  error: {
    message: string | null;
    stack: string | null;
    name: string | null;
    cause: unknown | null;
  };
}>
```

## Why use this library?

- **Cleaner code** - Avoid repetitive try-catch blocks throughout your codebase
- **Consistent error handling** - Standardized error object structure for all operations
- **TypeScript integration** - Full type safety with generics
- **Simplified error checking** - Just check the `isError` flag instead of handling try-catch everywhere

## License

MIT

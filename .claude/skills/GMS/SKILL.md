```markdown
# GMS Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the core development patterns and conventions used in the GMS TypeScript codebase. It covers file naming, import/export styles, commit message practices, and testing patterns. While no specific frameworks are detected, the repository follows clear conventions to ensure code consistency and maintainability.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `orderManager.ts`

### Import Style
- Mixed import styles are used, including both default and named imports.
  - Example:
    ```typescript
    import { getUser } from './userService';
    import config from './config';
    ```

### Export Style
- Prefer **named exports**.
  - Example:
    ```typescript
    // userService.ts
    export function getUser(id: string) { /* ... */ }
    export const USER_ROLE = 'admin';
    ```

### Commit Messages
- Commit messages are freeform, with no strict prefixing.
- Average commit message length is 54 characters.
  - Example:
    ```
    Fix bug in order processing when user is inactive
    ```

## Workflows

### Add a New Feature
**Trigger:** When implementing a new feature or module  
**Command:** `/add-feature`

1. Create a new file using camelCase naming.
2. Write your TypeScript code, using named exports.
3. Import dependencies using either named or default imports as appropriate.
4. Write or update corresponding test files (`*.test.*`).
5. Commit your changes with a clear, concise message.

### Update an Existing Module
**Trigger:** When modifying or refactoring existing code  
**Command:** `/update-module`

1. Locate the relevant file (camelCase naming).
2. Make necessary changes, maintaining the import/export conventions.
3. Update or add tests if needed.
4. Commit with a descriptive message.

### Write Tests
**Trigger:** When adding or updating code that needs testing  
**Command:** `/write-tests`

1. Create or update a test file matching the pattern `*.test.*`.
2. Write test cases for your code (testing framework is unspecified).
3. Run tests to verify correctness.

## Testing Patterns

- Test files follow the `*.test.*` naming pattern (e.g., `userService.test.ts`).
- The specific testing framework is not detected; use standard TypeScript testing practices.
- Place test files alongside or near the code they test.

  ```typescript
  // userService.test.ts
  import { getUser } from './userService';

  test('should return user by id', () => {
    const user = getUser('123');
    expect(user.id).toBe('123');
  });
  ```

## Commands
| Command        | Purpose                                 |
|----------------|-----------------------------------------|
| /add-feature   | Scaffold and implement a new feature    |
| /update-module | Update or refactor an existing module   |
| /write-tests   | Create or update test files             |
```

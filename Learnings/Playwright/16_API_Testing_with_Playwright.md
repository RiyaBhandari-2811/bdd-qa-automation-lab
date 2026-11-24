# 16: API Testing with Playwright

## APIRequestContext

Playwright can test REST APIs directly without browser automation.

### Basic API Call

```javascript
test('GET request', async ({ request }) => {
  const response = await request.get('https://api.example.com/users');
  
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(data).toHaveLength(5);
});
```

---

## HTTP Methods

### GET Request

```javascript
test('GET with query params', async ({ request }) => {
  const response = await request.get('https://api.example.com/users', {
    params: {
      page: 1,
      limit: 10,
      sort: 'name'
    }
  });
  
  expect(response.ok()).toBeTruthy();
});
```

### POST Request

```javascript
test('POST with JSON body', async ({ request }) => {
  const response = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    }
  });
  
  expect(response.status()).toBe(201);
  const user = await response.json();
  expect(user.id).toBeTruthy();
});
```

### PUT Request

```javascript
test('PUT request', async ({ request }) => {
  const response = await request.put('https://api.example.com/users/123', {
    data: {
      name: 'Jane Doe',
      email: 'jane@example.com'
    }
  });
  
  expect(response.status()).toBe(200);
});
```

### DELETE Request

```javascript
test('DELETE request', async ({ request }) => {
  const response = await request.delete('https://api.example.com/users/123');
  
  expect(response.status()).toBe(204);
});
```

---

## Request Headers

### Add Headers

```javascript
test('Request with headers', async ({ request }) => {
  const response = await request.get('https://api.example.com/data', {
    headers: {
      'Authorization': 'Bearer token123',
      'X-Custom-Header': 'custom-value',
      'Content-Type': 'application/json'
    }
  });
  
  expect(response.ok()).toBeTruthy();
});
```

---

## Authentication

### Bearer Token

```javascript
test('API with authentication', async ({ request }) => {
  const response = await request.get('https://api.example.com/protected', {
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`
    }
  });
  
  expect(response.ok()).toBeTruthy();
});
```

### Basic Auth

```javascript
test('Basic authentication', async ({ request }) => {
  const response = await request.get('https://api.example.com/data', {
    headers: {
      'Authorization': 'Basic ' + Buffer.from('user:pass').toString('base64')
    }
  });
  
  expect(response.ok()).toBeTruthy();
});
```

---

## Response Handling

### Parse Response

```javascript
test('Parse different response formats', async ({ request }) => {
  // JSON response
  const jsonResponse = await request.get('https://api.example.com/json');
  const jsonData = await jsonResponse.json();
  
  // Text response
  const textResponse = await request.get('https://api.example.com/text');
  const textData = await textResponse.text();
  
  // Buffer (binary)
  const bufferResponse = await request.get('https://api.example.com/file');
  const buffer = await bufferResponse.body();
});
```

---

## End-to-End API Testing

### Complete API Test Flow

```javascript
test('Complete E2E API test', async ({ request }) => {
  // 1. Create user (POST)
  const createResponse = await request.post('https://api.example.com/users', {
    data: { name: 'Alice', email: 'alice@example.com' }
  });
  
  expect(createResponse.status()).toBe(201);
  const user = await createResponse.json();
  const userId = user.id;
  
  // 2. Get user (GET)
  const getResponse = await request.get(`https://api.example.com/users/${userId}`);
  expect(getResponse.ok()).toBeTruthy();
  
  // 3. Update user (PUT)
  const updateResponse = await request.put(`https://api.example.com/users/${userId}`, {
    data: { name: 'Alice Updated' }
  });
  expect(updateResponse.status()).toBe(200);
  
  // 4. Delete user (DELETE)
  const deleteResponse = await request.delete(`https://api.example.com/users/${userId}`);
  expect(deleteResponse.status()).toBe(204);
});
```

---

## Combining API & UI Testing

### Setup via API, Test via UI

```javascript
test('Setup data via API, test via UI', async ({ request, page }) => {
  // Create test data via API (faster)
  const createResponse = await request.post('https://api.example.com/items', {
    data: { name: 'Test Item', price: 99 }
  });
  
  const item = await createResponse.json();
  
  // Then test UI with this data
  await page.goto('https://example.com/items');
  await expect(page.locator(`text=${item.name}`)).toBeVisible();
});
```

---

## Error Handling

```javascript
test('Handle API errors', async ({ request }) => {
  // Test 404
  const notFoundResponse = await request.get('https://api.example.com/users/9999');
  expect(notFoundResponse.status()).toBe(404);
  
  // Test 500
  const errorResponse = await request.get('https://api.example.com/error');
  expect(errorResponse.status()).toBe(500);
  
  // Check error message
  const errorData = await errorResponse.json();
  expect(errorData.message).toBeTruthy();
});
```

---

## 🏋️ Exercises

**Exercise 1**: Test a public API with GET and POST requests.

<details>
<summary>✅ Answer</summary>

```javascript
test('API GET and POST requests', async ({ request }) => {
  // GET request
  const listResponse = await request.get('https://api.example.com/users');
  expect(listResponse.ok()).toBeTruthy();
  
  const users = await listResponse.json();
  expect(Array.isArray(users)).toBeTruthy();
  
  // POST request
  const newUserResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    },
  });
  
  expect(newUserResponse.ok()).toBeTruthy();
  expect(newUserResponse.status()).toBe(201);
  
  const newUser = await newUserResponse.json();
  expect(newUser.id).toBeDefined();
  expect(newUser.email).toBe('john@example.com');
});
```

</details>

**Exercise 2**: Create a user via API and verify via UI.

<details>
<summary>✅ Answer</summary>

```javascript
test('Create user via API and verify in UI', async ({ page, request }) => {
  // Create user via API
  const createResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'SecurePass123!',
    },
  });
  
  const user = await createResponse.json();
  const userId = user.id;
  
  // Verify user exists via UI
  await page.goto('https://example.com/admin/users');
  
  // Search for the user
  await page.fill('#search', 'testuser@example.com');
  await page.click('button:has-text("Search")');
  
  // Verify user appears in list
  const userRow = page.locator(`text=${user.name}`);
  await expect(userRow).toBeVisible();
  
  // Verify user details
  await userRow.click();
  await expect(page.locator(`text=${user.email}`)).toBeVisible();
});
```

</details>

**Exercise 3**: Test error handling for invalid API requests.

<details>
<summary>✅ Answer</summary>

```javascript
test('API error handling', async ({ request }) => {
  // Test invalid email
  const invalidResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'Invalid User',
      email: 'not-an-email',
      password: 'pass123',
    },
  });
  
  expect(invalidResponse.status()).toBe(400);
  const errorData = await invalidResponse.json();
  expect(errorData.error).toContain('Invalid email');
  
  // Test missing required field
  const missingResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'No Email User',
      // Missing email
    },
  });
  
  expect(missingResponse.status()).toBe(400);
  
  // Test not found
  const notFoundResponse = await request.get('https://api.example.com/users/99999');
  expect(notFoundResponse.status()).toBe(404);
  
  // Test unauthorized
  const unAuthResponse = await request.delete('https://api.example.com/users/123');
  expect(unAuthResponse.status()).toBe(401);
});
```

</details>

---

## 🎤 Interview Questions

1. **What is APIRequestContext?**
   <details>
   <summary>Answer</summary>
   Playwright's built-in fixture for testing REST endpoints without needing external HTTP libraries
   </details>

2. **Can you use same authentication for API and UI?**
   <details>
   <summary>Answer</summary>
   Yes, can share tokens and headers between API requests and browser contexts for seamless testing
   </details>

3. **What's the benefit of setup via API instead of UI?**
   <details>
   <summary>Answer</summary>
   Much faster, more reliable, doesn't depend on UI implementation, reduces test maintenance
   </details>

4. **How do you handle different response formats?**
   <details>
   <summary>Answer</summary>
   Use `response.json()` for JSON, `response.text()` for text, `response.body()` for binary data
   </details>


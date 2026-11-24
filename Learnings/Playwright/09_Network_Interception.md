# 09: Network Interception

## Mocking API Responses

### Mock Specific Route

```javascript
test('Mock API response', async ({ page }) => {
  // Mock response
  await page.route('**/api/users', route => {
    route.abort();  // Cancel request
  });
  
  // Or respond with custom data
  await page.route('**/api/users', route => {
    route.abort('failed');
  });
});
```

### Respond with Custom Data

```javascript
test('Return custom response', async ({ page }) => {
  await page.route('**/api/users/**', route => {
    route.abort('connectionrefused');
  });
});
```

---

## Intercept & Modify Requests

```javascript
test('Intercept and modify request', async ({ page }) => {
  // Intercept network requests
  await page.route('**/*', route => {
    const request = route.request();
    
    // Log request
    console.log(request.url());
    console.log(request.method());
    console.log(request.postData());
    
    // Modify and continue
    if (request.url().includes('/api/users')) {
      route.continue({
        postData: JSON.stringify({ name: 'Modified User' })
      });
    } else {
      route.continue();
    }
  });
  
  await page.goto('https://example.com');
});
```

---

## Mock API Responses

```javascript
test('Mock successful API response', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' }
      ])
    });
  });
  
  await page.goto('https://example.com');
  
  // Verify mocked data is displayed
  await expect(page.locator('text=John')).toBeVisible();
});
```

---

## Mock Error Responses

```javascript
test('Handle API error', async ({ page }) => {
  // Mock 500 error
  await page.route('**/api/data', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server error' })
    });
  });
  
  await page.goto('https://example.com');
  
  // Verify error handling
  await expect(page.locator('.error')).toBeVisible();
});
```

---

## Abort Network Requests

```javascript
test('Abort images to test fallback', async ({ page }) => {
  // Abort all images
  await page.route('**/*.png', route => route.abort());
  await page.route('**/*.jpg', route => route.abort());
  
  await page.goto('https://example.com');
  
  // Verify fallback text shown
  await expect(page.locator('.alt-text')).toBeVisible();
});
```

---

## Monitor Network

```javascript
test('Monitor network activity', async ({ page }) => {
  const requests = [];
  const responses = [];
  
  // Track all requests
  page.on('request', request => {
    requests.push(request.url());
  });
  
  // Track all responses
  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status()
    });
  });
  
  await page.goto('https://example.com');
  
  console.log('Requests:', requests);
  console.log('Responses:', responses);
});
```

---

## Wait for Network Response

```javascript
test('Wait for API call', async ({ page }) => {
  // Wait for specific API response
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/users')
  );
  
  // Trigger API call
  await page.click('#load-users');
  
  // Get response
  const response = await responsePromise;
  const data = await response.json();
  
  console.log(data);
});
```

---

## 🏋️ Exercises

**Exercise 1**: Mock an API endpoint and verify the mocked data displays on page.

**Exercise 2**: Abort image loading and verify alt text is shown.

**Exercise 3**: Monitor all network requests and responses on a page.

---

## 🎤 Interview Questions

1. **What is network interception used for?**
   - Mock APIs, test error scenarios, improve test speed, modify requests

2. **How do you mock an API response?**
   - Use `page.route()` with `route.fulfill()` to return custom response

3. **How do you abort a network request?**
   - Use `route.abort()` or `route.abort('failed')` with error type

4. **Can you modify request headers?**
   - Yes, in `route.continue()` with headers parameter


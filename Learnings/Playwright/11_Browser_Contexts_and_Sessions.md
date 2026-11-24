# 11: Browser Contexts and Sessions

## What is a Browser Context?

A **context** is an isolated browser session. Each context has:
- Separate cookies and localStorage
- Independent sessions
- Own cache

---

## Creating Contexts

### Create Multiple Contexts

```javascript
test('Multiple browser contexts', async ({ browser }) => {
  // Context 1 - User A
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  await page1.goto('https://example.com');
  await page1.locator('#email').fill('usera@example.com');
  
  // Context 2 - User B
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto('https://example.com');
  await page2.locator('#email').fill('userb@example.com');
  
  // Both contexts are independent
  
  await context1.close();
  await context2.close();
});
```

---

## Managing Cookies

### Add Cookies

```javascript
test('Set cookies', async ({ context, page }) => {
  // Add single cookie
  await context.addCookies([
    {
      name: 'sessionId',
      value: '123456789',
      url: 'https://example.com'
    }
  ]);
  
  await page.goto('https://example.com');
});
```

### Get Cookies

```javascript
test('Get cookies', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  // Get all cookies
  const cookies = await context.cookies();
  
  console.log(cookies);
  // [ { name: 'sessionId', value: '123456789', ... } ]
});
```

### Clear Cookies

```javascript
test('Clear cookies', async ({ context, page }) => {
  // Clear specific cookie
  await context.clearCookies({ name: 'sessionId' });
  
  // Or clear all
  await context.clearCookies();
});
```

---

## Local Storage

### Set LocalStorage

```javascript
test('Set localStorage', async ({ context, page }) => {
  await context.addInitScript(() => {
    window.localStorage.setItem('theme', 'dark');
    window.localStorage.setItem('lang', 'en');
  });
  
  await page.goto('https://example.com');
});
```

### Get LocalStorage

```javascript
test('Read localStorage', async ({ page }) => {
  const theme = await page.evaluate(() => localStorage.getItem('theme'));
  console.log(theme);
});
```

---

## Session Storage

### Set SessionStorage

```javascript
test('Use sessionStorage', async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem('temporaryData', 'some-value');
  });
  
  // SessionStorage persists during page navigation
  const value = await page.evaluate(() => sessionStorage.getItem('temporaryData'));
  console.log(value);
});
```

---

## Persistent Context (Saved Session)

### Save Context Storage

```javascript
test('Save context state', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login and perform actions
  await page.goto('https://example.com/login');
  await page.locator('#username').fill('user');
  await page.locator('#password').fill('pass');
  await page.click('button[type="submit"]');
  
  // Save context state
  await context.storageState({ path: 'auth.json' });
  
  await context.close();
});
```

### Restore Context Storage

```javascript
test('Restore saved context', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'auth.json'  // Restore cookies, localStorage, etc.
  });
  
  const page = await context.newPage();
  
  // Already logged in!
  await page.goto('https://example.com/dashboard');
  
  await context.close();
});
```

---

## Reuse Authentication

```javascript
// In playwright.config.js
export default defineConfig({
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        storageState: 'auth.json',  // Reuse auth for all tests
      },
    },
  ],
});
```

---

## 🏋️ Exercises

**Exercise 1**: Create two browser contexts simulating two different users.

**Exercise 2**: Save authentication state and reuse it in multiple tests.

**Exercise 3**: Set custom localStorage values before navigation.

---

## 🎤 Interview Questions

1. **What is a browser context?**
   - Isolated browser session with separate cookies, storage, and cache

2. **What's the difference between cookies and localStorage?**
   - Cookies sent to server automatically; localStorage only on client side

3. **How do you save authentication state?**
   - Use `context.storageState({ path: 'auth.json' })` to save

4. **Can you use same authentication across multiple tests?**
   - Yes, via `storageState` in context configuration


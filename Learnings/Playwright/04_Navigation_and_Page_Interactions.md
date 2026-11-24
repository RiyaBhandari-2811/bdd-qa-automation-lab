# 04: Navigation and Page Interactions

## Page Navigation

### Navigate to URL
```javascript
// Simple navigation
await page.goto('https://example.com');

// With wait options
await page.goto('https://example.com', {
  waitUntil: 'networkidle'  // Wait until network is idle
});
```

### Wait Options
- `load` - Wait for load event (default)
- `domcontentloaded` - Wait for DOMContentLoaded
- `networkidle` - Wait until no network activity

---

## Basic Interactions

### Click
```javascript
// Click element
await page.locator('button').click();

// Double click
await page.locator('button').dblclick();

// Right click
await page.locator('button').click({ button: 'right' });
```

### Type & Fill
```javascript
// Type character by character
await page.locator('#email').type('user@example.com');

// Fill (clears then types)
await page.locator('#email').fill('user@example.com');

// Press key
await page.keyboard.press('Enter');
```

### Check & Select
```javascript
// Check checkbox
await page.locator('input[type="checkbox"]').check();

// Uncheck checkbox
await page.locator('input[type="checkbox"]').uncheck();

// Select dropdown option
await page.locator('select').selectOption('option-value');
```

---

## Page Methods

### Get Page Info
```javascript
// Get current URL
const url = page.url();

// Get page title
const title = await page.title();

// Get page content
const content = await page.content();

// Get HTML
const html = await page.innerHTML('div');

// Get text
const text = await page.textContent('p');
```

### Navigation
```javascript
// Go back
await page.goBack();

// Go forward
await page.goForward();

// Reload page
await page.reload();
```

---

## Working with Multiple Tabs

```javascript
// Open new page/tab
const newPage = await browser.newPage();

// Get all pages
const pages = context.pages();

// Close page
await page.close();
```

---

## Example: Complete Login Flow

```javascript
test('Login workflow', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://example.com/login');
  
  // Fill email
  await page.locator('#email').fill('user@example.com');
  
  // Fill password
  await page.locator('#password').fill('password123');
  
  // Click submit
  await page.locator('button[type="submit"]').click();
  
  // Verify login success
  expect(page.url()).toContain('/dashboard');
});
```

---

## 🏋️ Exercises

**Exercise 1**: Create a test that navigates to Google, searches for "Playwright", and verifies results.

<details>
<summary>✅ Answer</summary>

```javascript
test('Search on Google', async ({ page }) => {
  // Navigate to Google
  await page.goto('https://www.google.com');
  
  // Fill search box
  await page.locator('input[name="q"]').fill('Playwright');
  
  // Press Enter or click search
  await page.keyboard.press('Enter');
  
  // Wait for results
  await page.waitForNavigation();
  
  // Verify results contain Playwright
  expect(page.url()).toContain('search');
  
  // Check if results are displayed
  const results = await page.locator('h3').count();
  expect(results).toBeGreaterThan(0);
});
```

</details>

**Exercise 2**: Write a test that fills a form and submits it.

<details>
<summary>✅ Answer</summary>

```javascript
test('Fill and submit form', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  // Fill form fields
  await page.locator('#firstName').fill('John');
  await page.locator('#lastName').fill('Doe');
  await page.locator('#email').fill('john@example.com');
  await page.locator('#message').fill('This is a test message');
  
  // Submit form
  await page.locator('button[type="submit"]').click();
  
  // Verify success
  await expect(page.locator('.success-message')).toBeVisible();
});
```

</details>

**Exercise 3**: Create a test with multiple page interactions (click, type, check checkbox).

<details>
<summary>✅ Answer</summary>

```javascript
test('Multiple interactions', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Type in search box
  await page.locator('#search').fill('Playwright Tutorial');
  
  // Click search button
  await page.locator('#searchBtn').click();
  
  // Wait for results
  await page.waitForNavigation();
  
  // Check newsletter checkbox
  await page.locator('input[type="checkbox"][name="newsletter"]').check();
  
  // Click subscribe button
  await page.locator('button:has-text("Subscribe")').click();
  
  // Verify confirmation
  await expect(page.locator('text=Thank you')).toBeVisible();
});
```

</details>

---

## 🎤 Interview Questions

1. **What's the difference between `type()` and `fill()` methods?**
   <details>
   <summary>Answer</summary>
   `fill()` clears the field first then types (better for form fields), `type()` appends to existing text (character by character)
   </details>

2. **What does `waitUntil: 'networkidle'` do?**
   <details>
   <summary>Answer</summary>
   Waits for page to load until there's no network activity for 500ms (useful for AJAX-heavy applications)
   </details>

3. **How do you switch between browser tabs?**
   <details>
   <summary>Answer</summary>
   Use `context.pages()` to get all pages and switch between them, or use `waitForEvent('page')` for new tabs
   </details>

4. **Can you interact with elements not visible on screen?**
   <details>
   <summary>Answer</summary>
   Yes, Playwright auto-scrolls elements into view before interaction (use `scrollIntoViewIfNeeded()`)
   </details>


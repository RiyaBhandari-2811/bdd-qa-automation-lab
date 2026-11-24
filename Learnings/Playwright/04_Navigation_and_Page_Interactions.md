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

**Exercise 2**: Write a test that fills a form and submits it.

**Exercise 3**: Create a test with multiple page interactions (click, type, check checkbox).

---

## 🎤 Interview Questions

1. **What's the difference between `type()` and `fill()` methods?**
   - `fill()` clears the field first, `type()` appends to existing text

2. **What does `waitUntil: 'networkidle'` do?**
   - Waits for page to load until there's no network activity

3. **How do you switch between browser tabs?**
   - Use `context.pages()` to get all pages and switch between them

4. **Can you interact with elements not visible on screen?**
   - Yes, Playwright auto-scrolls elements into view before interaction


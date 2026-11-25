# 03: Selectors Basics

## What is a Selector?

A selector is a way to **identify and locate elements** on a web page. Playwright supports multiple selector types.

---

## Selector Types

### 1. CSS Selectors

```javascript
// By class
page.locator('.button-primary')

// By ID
page.locator('#submit')

// By attribute
page.locator('[data-test="login"]')

// By tag
page.locator('input')

// Combination
page.locator('div.container > button.submit')
```

### 2. XPath Selectors

```javascript
// By text
page.locator("//button[contains(text(), 'Submit')]")

// By attribute
page.locator("//input[@type='email']")

// By position
page.locator("(//button)[1]")

// Parent
page.locator("//button/ancestor::form")
```

### 3. Text Selector

```javascript
// Exact text
page.locator('text=Submit')

// Partial text
page.locator('text=/Submit/i')
```

### 4. Role Selector (Recommended)

```javascript
// By ARIA role
page.locator('role=button')
page.locator('role=textbox')
page.locator('role=link')

// With name
page.locator('role=button[name="Submit"]')
page.locator('role=textbox[name="Email"]')
```

---

## Locator API

### Basic Locator Methods

```javascript
const locator = page.locator('.button');

// Click element
await locator.click();

// Type text
await locator.fill('Hello');

// Get text
const text = await locator.textContent();

// Check if visible
const isVisible = await locator.isVisible();

// Get element count
const count = await locator.count();

// Get nth element
const secondButton = page.locator('button').nth(1);
```

---

## Selector Priority (Recommended Order)

1. **Role selector** - Most robust, semantic
2. **CSS selector** - Fast, specific
3. **XPath** - Last resort, fragile

---

## Best Practices

✅ **DO**
```javascript
page.locator('role=button[name="Submit"]')
page.locator('#user-email')
page.locator('[data-testid="login-btn"]')
```

❌ **DON'T**
```javascript
page.locator('/html/body/div[1]/button[3]')  // Too specific
page.locator('.btn.btn-primary.btn-lg')      // Too many classes
```

---

## 🏋️ Exercises

**Exercise 1**: Write 3 different selectors to find a button with text "Login".

<details>
<summary>✅ Answer</summary>

```javascript
// 1. CSS Selector
page.locator('button:has-text("Login")')

// 2. XPath Selector
page.locator("//button[contains(text(), 'Login')]")

// 3. Role Selector (Most Recommended)
page.locator('role=button[name="Login"]')
```

</details>

**Exercise 2**: Create selectors for email input using CSS, XPath, and role selectors.

<details>
<summary>✅ Answer</summary>

```javascript
// 1. CSS Selector
page.locator('input[type="email"]')

// 2. XPath Selector
page.locator("//input[@type='email']")

// 3. Role Selector
page.locator('role=textbox[name="Email"]')

// 4. Using label association (Best practice)
page.locator('label:has-text("Email") >> ../input')
```

</details>

**Exercise 3**: Find all buttons on a page and get their count.

<details>
<summary>✅ Answer</summary>

```javascript
test('Count buttons on page', async ({ page }) => {
  await page.goto('https://example.com');
  
  const buttonCount = await page.locator('button').count();
  console.log(`Total buttons: ${buttonCount}`);
  
  expect(buttonCount).toBeGreaterThan(0);
  
  // Iterate through each button
  for (let i = 0; i < buttonCount; i++) {
    const text = await page.locator('button').nth(i).textContent();
    console.log(`Button ${i + 1}: ${text}`);
  }
});
```

</details>

---

## 🎤 Interview Questions

1. **What is a selector in Playwright?**
   <details>
   <summary>Answer</summary>
   Method to identify and locate elements on a web page. Can be CSS, XPath, role-based, or text-based.
   </details>

2. **Which selector type is most reliable?**
   <details>
   <summary>Answer</summary>
   Role selector as it's based on semantic HTML and accessibility standards, making it resilient to DOM changes.
   </details>

3. **What's the difference between XPath and CSS selector?**
   <details>
   <summary>Answer</summary>
   XPath can traverse up and down the DOM (parent/ancestor/sibling), CSS only traverses down. XPath is slower but more flexible.
   </details>

4. **Can you use regular expressions in text selectors?**
   <details>
   <summary>Answer</summary>
   Yes, use `text=/pattern/flags` syntax (e.g., `text=/login/i` for case-insensitive)
   </details>


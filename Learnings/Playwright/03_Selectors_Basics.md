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

**Exercise 2**: Create selectors for email input using CSS, XPath, and role selectors.

**Exercise 3**: Find all buttons on a page and get their count.

---

## 🎤 Interview Questions

1. **What is a selector in Playwright?**
   - Method to identify and locate elements on a web page

2. **Which selector type is most reliable?**
   - Role selector as it's based on semantic HTML and accessibility

3. **What's the difference between XPath and CSS selector?**
   - XPath can traverse up and down the DOM, CSS is faster but only traverses down

4. **Can you use regular expressions in text selectors?**
   - Yes, use `text=/pattern/flags` syntax


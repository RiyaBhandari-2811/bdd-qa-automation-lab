# 07: Working with Elements

## Element Properties

### Get Element Information

```javascript
// Get text content
const text = await page.locator('h1').textContent();

// Get inner HTML
const html = await page.locator('div').innerHTML();

// Get attribute
const href = await page.locator('a').getAttribute('href');

// Get all attributes
const attrs = await page.locator('input').evaluate(el => 
  Object.fromEntries(new FormData(el))
);
```

### Element Visibility & State

```javascript
// Check if visible
const isVisible = await page.locator('.element').isVisible();

// Check if enabled
const isEnabled = await page.locator('button').isEnabled();

// Check if disabled
const isDisabled = await page.locator('input').isDisabled();

// Check if checked (checkbox/radio)
const isChecked = await page.locator('input[type="checkbox"]').isChecked();
```

---

## Element Counts & Filtering

```javascript
// Count elements
const count = await page.locator('button').count();

// Get nth element
const secondButton = page.locator('button').nth(1);

// Filter by text
const submitBtn = page.locator('button').filter({ hasText: 'Submit' });

// Filter by another locator
const visibleBtns = page.locator('button').filter({ has: page.locator(':visible') });
```

---

## Working with Multiple Elements

```javascript
test('Work with multiple elements', async ({ page }) => {
  // Get all items
  const items = page.locator('.item');
  
  // Get count
  const count = await items.count();
  
  // Iterate through each
  for (let i = 0; i < count; i++) {
    const text = await items.nth(i).textContent();
    console.log(text);
  }
});
```

---

## Element Scrolling

```javascript
// Scroll element into view
await page.locator('#target').scrollIntoViewIfNeeded();

// Scroll page
await page.evaluate(() => window.scrollBy(0, 500));
```

---

## Hover & Focus

```javascript
// Hover over element
await page.locator('.menu').hover();

// Focus on element
await page.locator('input').focus();

// Blur (lose focus)
await page.locator('input').blur();
```

---

## JavaScript Evaluation

```javascript
// Evaluate JavaScript on page
const title = await page.evaluate(() => document.title);

// Get element properties via JS
const width = await page.locator('.box').evaluate(el => el.offsetWidth);

// Modify DOM
await page.evaluate(() => {
  document.body.style.backgroundColor = 'red';
});
```

---

## Get Multiple Values

```javascript
test('Extract multiple values', async ({ page }) => {
  const products = await page.locator('.product').evaluateAll(elements =>
    elements.map(el => ({
      name: el.querySelector('.name')?.textContent,
      price: el.querySelector('.price')?.textContent,
      link: el.href
    }))
  );
  
  console.log(products);
});
```

---

## 🏋️ Exercises

**Exercise 1**: Get all links on a page and extract their href attributes.

**Exercise 2**: Count how many buttons are on a page and filter only enabled ones.

**Exercise 3**: Scroll to an element and verify its visibility.

---

## 🎤 Interview Questions

1. **What's the difference between `textContent()` and `innerHTML()`?**
   - textContent returns plain text; innerHTML returns HTML string

2. **How do you check if a button is enabled?**
   - Use `isEnabled()` method on the button locator

3. **How do you iterate through multiple elements?**
   - Get count with `count()` and loop using `nth(i)`

4. **Can you evaluate custom JavaScript in Playwright?**
   - Yes, using `evaluate()` and `evaluateAll()` methods


# 13: Advanced Selectors

## Role Selectors (Advanced)

### ARIA Roles

```javascript
// Generic roles
page.locator('role=button')
page.locator('role=textbox')
page.locator('role=link')
page.locator('role=heading')
page.locator('role=menu')
page.locator('role=listbox')
page.locator('role=dialog')

// With attributes
page.locator('role=button[name="Submit"]')
page.locator('role=button[pressed="true"]')
page.locator('role=option[selected="true"]')
```

### Hierarchical Role Selectors

```javascript
// Nested roles
page.locator('role=listbox >> role=option[selected="true"]')

// Parent-child relationship
page.locator('role=main >> role=button[name="Click me"]')
```

---

## Complex XPath

### Advanced XPath Patterns

```javascript
// Following sibling
page.locator('//button[@class="edit"] / following-sibling::button[1]')

// Preceding sibling
page.locator('//span[@class="label"] / preceding-sibling::input[1]')

// Not condition
page.locator('//button[not(contains(@class, "disabled"))]')

// Multiple conditions
page.locator('//div[@class="card"] and not(contains(text(), "Sold Out"))')

// Parent traversal
page.locator('//span[text()="Price"] / ancestor::div[@class="product"]')

// Last element
page.locator('(//button)[last()]')
```

---

## Locator Combinators

### Combining Locators

```javascript
// AND - element matching both
page.locator('div:has(.header):has(.footer)')

// OR - either locator
page.locator('button:visible, button[disabled]')

// Parent-child
page.locator('form >> input[type="email"]')

// Sibling
page.locator('label:text("Email") >> ../input')
```

---

## Locator Filters

### Filter by Visibility

```javascript
// Visible elements only
page.locator('button:visible')

// Hidden elements
page.locator('button:hidden')
```

### Filter by Text

```javascript
// Exact text
page.locator('button', { hasText: 'Save' })

// Partial text
page.locator('div', { hasText: /Price: \$/ })

// Filter then chain
page.locator('button').filter({ hasText: 'Delete' }).nth(0)
```

### Filter by Locator

```javascript
// Element contains another element
page.locator('div:has(> .icon)')

// Element contains descendant
page.locator('div:has(.badge)')

// Element not containing
page.locator('div:not(:has(.disabled))')
```

---

## Relative Locators

### Relative to Another Element

```javascript
// Get element next to another
page.locator('text=Jane >> ../button')

// Get element before label
page.locator('>> role=textbox >> ../label:has-text("Email")')

// Get parent element
page.locator('>> .child-element >> ..')
```

---

## Custom Locator Functions

### Evaluate-based Selection

```javascript
// Select by custom property
page.locator('text="Button"').locator('>> //button[@custom-id="123"]')

// Select by exact text match (case-sensitive)
page.locator('button').filter({
  hasText: /^Exact Button Text$/
})
```

---

## Performance Tips

### Optimal Selector Strategy

```javascript
// SLOW: Multiple traversals
page.locator('body').locator('div').locator('.container').locator('button')

// FAST: Single selector
page.locator('.container button')

// SLOW: Complex XPath
page.locator('//div[@class="a"]/div[@class="b"]/button')

// FAST: Simple and specific
page.locator('div.container button.action')
```

---

## Testing Selectors

### Validate Selector in Console

```javascript
test('Debug selectors', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Count matches
  const count = await page.locator('role=button').count();
  console.log(`Found ${count} buttons`);
  
  // Test selector is working
  const isVisible = await page.locator('.hidden-element').isVisible();
  console.log(`Visible: ${isVisible}`);
});
```

---

## 🏋️ Exercises

**Exercise 1**: Write a complex XPath to find a button inside a specific modal.

<details>
<summary>✅ Answer</summary>

```javascript
test('Complex XPath selector', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Find button with text "Delete" inside a modal with class "danger-modal"
  const deleteButton = page.locator("//div[@class='danger-modal']//button[contains(text(), 'Delete')]");
  
  // Or use XPath with specific attributes
  const modalButton = page.locator(
    "//div[contains(@class, 'modal') and contains(@class, 'active')]//button[@type='submit']"
  );
  
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
});
```

</details>

**Exercise 2**: Use role selectors to find disabled buttons only.

<details>
<summary>✅ Answer</summary>

```javascript
test('Find disabled buttons with role selector', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Find all buttons with disabled role/state
  const disabledButtons = page.locator('button:disabled');
  
  // Or using role selector
  const buttons = page.locator('role=button');
  const disabledOnes = buttons.locator(':disabled');
  
  // Count disabled buttons
  const count = await disabledOnes.count();
  console.log(`Found ${count} disabled buttons`);
  
  // Verify they are not clickable
  for (let i = 0; i < count; i++) {
    const btn = disabledOnes.nth(i);
    await expect(btn).toBeDisabled();
  }
});
```

</details>

**Exercise 3**: Create a combined selector using multiple filters.

<details>
<summary>✅ Answer</summary>

```javascript
test('Combined selector with multiple filters', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Find specific product card
  const productCard = page.locator('.product-card')
    .filter({ hasText: 'Electronics' })
    .filter({ has: page.locator('.rating:has-text("4.5")') });
  
  await expect(productCard).toBeVisible();
  
  // Or chain multiple conditions
  const item = page.locator('div')
    .filter({ hasNot: page.locator('.sold-out') })
    .filter({ has: page.locator('price >> text=$100') })
    .first();
  
  // Verify the filtered result
  await expect(item).toHaveClass(/active/);\n});
```

</details>

---

## 🎤 Interview Questions

1. **What are ARIA role selectors?**
   <details>
   <summary>Answer</summary>
   Selectors based on semantic HTML roles, most accessible and reliable way to find elements
   </details>

2. **What's the difference between XPath and CSS selectors?**
   <details>
   <summary>Answer</summary>
   XPath can traverse up and down the DOM; CSS traverses down only. XPath is slower but more flexible
   </details>

3. **Can you filter locators after selection?**
   <details>
   <summary>Answer</summary>
   Yes, use `filter()` method to narrow down selected elements by text, attributes, or nested elements
   </details>

4. **What's the fastest way to find an element?**
   <details>
   <summary>Answer</summary>
   Use CSS selectors or role selectors with specific IDs or data-testid attributes
   </details>


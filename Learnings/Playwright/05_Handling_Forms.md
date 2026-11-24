# 05: Handling Forms

## Form Basics

Forms are interactive elements that collect user input. Playwright provides powerful methods for form handling.

---

## Common Form Elements

### Text Input
```javascript
// Fill text input
await page.locator('input[type="text"]').fill('John Doe');

// By label
await page.locator('label:has-text("Name") + input').fill('John');
```

### Email Input
```javascript
await page.locator('input[type="email"]').fill('user@example.com');
```

### Password Input
```javascript
await page.locator('input[type="password"]').fill('SecurePass123');
```

### Textarea
```javascript
await page.locator('textarea').fill('Multi-line text here...');
```

### Checkbox
```javascript
// Check
await page.locator('input[type="checkbox"]').check();

// Uncheck
await page.locator('input[type="checkbox"]').uncheck();

// Is checked
const isChecked = await page.locator('input[type="checkbox"]').isChecked();
```

### Radio Button
```javascript
// Select radio
await page.locator('input[value="option1"]').check();
```

### Dropdown/Select
```javascript
// Select by value
await page.locator('select#country').selectOption('US');

// Select by label
await page.locator('select').selectOption({ label: 'United States' });

// Get selected option
const selected = await page.locator('select').inputValue();
```

---

## Form Submission

```javascript
// Click submit button
await page.locator('button[type="submit"]').click();

// Or use form submission
await page.locator('form').evaluate(form => form.submit());
```

---

## Complete Form Example

```javascript
test('Fill and submit contact form', async ({ page }) => {
  await page.goto('https://example.com/contact');
  
  // Fill form fields
  await page.locator('#name').fill('Jane Smith');
  await page.locator('#email').fill('jane@example.com');
  await page.locator('#message').fill('Hello, this is a test message');
  
  // Check terms checkbox
  await page.locator('input[name="terms"]').check();
  
  // Select country
  await page.locator('#country').selectOption('US');
  
  // Submit form
  await page.locator('button[type="submit"]').click();
  
  // Verify success
  expect(page.locator('text=Success')).toBeVisible();
});
```

---

## Form Validation

```javascript
test('Validate form errors', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  // Submit empty form
  await page.locator('button[type="submit"]').click();
  
  // Check error messages
  await expect(
    page.locator('.error-message:has-text("Email is required")')
  ).toBeVisible();
});
```

---

## Multiple File Upload

```javascript
// Single file
await page.locator('input[type="file"]').setInputFiles('path/to/file.pdf');

// Multiple files
await page.locator('input[type="file"]').setInputFiles([
  'path/to/file1.pdf',
  'path/to/file2.pdf'
]);
```

---

## 🏋️ Exercises

**Exercise 1**: Create a test for a registration form with email, password, and confirm password fields.

**Exercise 2**: Write a test that fills a form, validates error messages, then corrects and submits.

**Exercise 3**: Test a file upload form with multiple file attachments.

---

## 🎤 Interview Questions

1. **What method is used to select a dropdown option?**
   - `selectOption()` method with value or label

2. **How do you check a checkbox in Playwright?**
   - Use `check()` method on checkbox locator

3. **What's the difference between form submit and button click?**
   - Form submit triggers form's onsubmit event, button click just clicks the element

4. **Can you upload multiple files at once?**
   - Yes, using `setInputFiles()` with array of file paths


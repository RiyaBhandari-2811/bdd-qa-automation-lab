# 08: Handling Popups and Dialogs

## JavaScript Dialogs

### Alert Dialog

```javascript
test('Handle alert', async ({ page }) => {
  // Listen for dialog
  page.once('dialog', dialog => {
    console.log(dialog.message());
    dialog.accept();  // Click OK
  });
  
  // Trigger alert
  await page.click('#show-alert');
});
```

### Confirm Dialog

```javascript
test('Handle confirm dialog', async ({ page }) => {
  // Accept confirm
  page.once('dialog', dialog => {
    dialog.accept();  // Click OK
  });
  await page.click('#confirm-btn');
  
  // Dismiss confirm
  page.once('dialog', dialog => {
    dialog.dismiss();  // Click Cancel
  });
  await page.click('#confirm-btn');
});
```

### Prompt Dialog

```javascript
test('Handle prompt dialog', async ({ page }) => {
  page.once('dialog', dialog => {
    console.log(dialog.message());
    dialog.accept('User Input');  // Enter text and click OK
  });
  
  await page.click('#show-prompt');
});
```

---

## Popup Windows (New Tabs)

```javascript
test('Handle popup window', async ({ context, page }) => {
  // Wait for new page/popup
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.click('#open-popup')
  ]);
  
  // Interact with popup
  await popup.locator('#input').fill('data');
  await popup.locator('button').click();
  
  // Close popup
  await popup.close();
});
```

---

## Handling Multiple Popups

```javascript
test('Handle multiple dialogs', async ({ page }) => {
  let dialogCount = 0;
  
  // Set up listener for all dialogs
  page.on('dialog', async dialog => {
    dialogCount++;
    console.log(`Dialog ${dialogCount}: ${dialog.message()}`);
    await dialog.accept();
  });
  
  // Trigger dialogs
  await page.click('#trigger-dialogs');
  
  // Verify count
  expect(dialogCount).toBe(3);
});
```

---

## Modal Dialogs (Custom)

```javascript
test('Handle custom modal', async ({ page }) => {
  // Click to open modal
  await page.locator('#open-modal').click();
  
  // Wait for modal to appear
  await page.locator('.modal').waitFor({ state: 'visible' });
  
  // Fill form in modal
  await page.locator('.modal input').fill('data');
  
  // Submit
  await page.locator('.modal button[type="submit"]').click();
  
  // Wait for modal to close
  await page.locator('.modal').waitFor({ state: 'hidden' });
});
```

---

## Handling File Dialogs

```javascript
test('Handle file dialog', async ({ page }) => {
  // Start waiting for file chooser
  const fileChooserPromise = page.waitForEvent('filechooser');
  
  // Click to open file dialog
  await page.click('#upload-button');
  
  // Set file
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('/path/to/file.pdf');
});
```

---

## Page Unload Events

```javascript
test('Handle beforeunload', async ({ page }) => {
  // Listen for dialog before page unload
  page.once('dialog', dialog => {
    dialog.accept();  // Confirm leaving page
  });
  
  // Navigate away (might trigger beforeunload)
  await page.goto('https://example.com/other');
});
```

---

## 🏋️ Exercises

**Exercise 1**: Create a test that handles an alert dialog showing a message.

<details>
<summary>✅ Answer</summary>

```javascript
test('Handle alert dialog', async ({ page }) => {
  let alertMessage = '';
  
  // Listen for alert
  page.once('dialog', dialog => {
    alertMessage = dialog.message();
    console.log(`Alert: ${alertMessage}`);
    
    // Accept alert (click OK)
    dialog.accept();
  });
  
  // Navigate to page that triggers alert
  await page.goto('https://example.com/alert-page');
  
  // Click to trigger alert
  await page.click('#showAlert');
  
  // Verify alert was shown
  expect(alertMessage).toContain('expected message');
});
```

</details>

**Exercise 2**: Write a test for a confirm dialog that dismisses it and verifies the result.

<details>
<summary>✅ Answer</summary>

```javascript
test('Handle confirm dialog - dismiss', async ({ page }) => {
  page.once('dialog', dialog => {
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toContain('Are you sure');
    
    // Dismiss (click Cancel)
    dialog.dismiss();
  });
  
  // Navigate to confirm dialog
  await page.goto('https://example.com/confirm');
  
  // Trigger confirm dialog
  await page.click('#deleteBtn');
  
  // Verify item was not deleted
  await expect(page.locator('text=Item deleted')).not.toBeVisible();
  await expect(page.locator('.item')).toBeVisible();
});
```

</details>

**Exercise 3**: Create a test that opens a popup window and fills a form in it.

<details>
<summary>✅ Answer</summary>

```javascript
test('Handle popup window', async ({ context, page }) => {
  // Start waiting for popup before triggering it
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.click('#openPopup')
  ]);
  
  // Interact with popup
  await popup.locator('#popupEmail').fill('popup@example.com');
  await popup.locator('#popupMessage').fill('Message from popup');
  
  // Submit form in popup
  await popup.locator('button[type="submit"]').click();
  
  // Verify popup action
  await expect(popup.locator('.success')).toBeVisible();
  
  // Close popup
  await popup.close();
});
```

</details>

---

## 🎤 Interview Questions

1. **How do you handle a JavaScript alert in Playwright?**
   <details>
   <summary>Answer</summary>
   Use `page.once('dialog', dialog => dialog.accept())` to listen and handle the alert
   </details>

2. **What's the difference between `accept()` and `dismiss()`?**
   <details>
   <summary>Answer</summary>
   `accept()` clicks OK/Yes, `dismiss()` clicks Cancel/No button on the dialog
   </details>

3. **How do you handle a file upload dialog?**
   <details>
   <summary>Answer</summary>
   Use `waitForEvent('filechooser')` to listen, then `setFiles()` to upload files
   </details>

4. **Can you interact with popup windows?**
   <details>
   <summary>Answer</summary>
   Yes, use `context.waitForEvent('page')` to get popup reference, then interact with it
   </details>


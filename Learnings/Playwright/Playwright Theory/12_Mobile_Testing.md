# 12: Mobile Testing

## Mobile Emulation

Playwright can emulate mobile devices without actual mobile hardware.

### Device Emulation

```javascript
import { devices } from '@playwright/test';

test('Mobile iPhone test', async ({ browser }) => {
  // Create context with iPhone emulation
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  await context.close();
});
```

---

## Popular Devices

```javascript
// Available device profiles
{
  ...devices['iPhone 12']
  ...devices['iPhone 13']
  ...devices['Pixel 5']
  ...devices['Galaxy S9+']
  ...devices['iPad Pro']
  ...devices['iPad Mini']
}
```

---

## Mobile Configuration in Config

### Configure Mobile in playwright.config.js

```javascript
export default defineConfig({
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile iPhone',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Mobile Android',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

---

## Responsive Testing

### Test Multiple Viewports

```javascript
test('Responsive design', async ({ page }) => {
  const viewports = [
    { width: 1920, height: 1080 },  // Desktop
    { width: 768, height: 1024 },   // Tablet
    { width: 375, height: 667 },    // Mobile
  ];
  
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('https://example.com');
    
    // Test responsive behavior
    await expect(page.locator('.mobile-menu')).toBeVisible();
  }
});
```

---

## Viewport Size

### Set Custom Viewport

```javascript
test('Custom viewport', async ({ page }) => {
  // Set viewport before navigation
  await page.setViewportSize({ width: 400, height: 800 });
  
  await page.goto('https://example.com');
  
  // Verify mobile styles applied
  await expect(page.locator('.hamburger-menu')).toBeVisible();
});
```

---

## Touch Interactions

### Tap Instead of Click

```javascript
test('Mobile touch interactions', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  // Tap button (same as click on mobile)
  await page.locator('button').tap();
  
  // Swipe
  await page.locator('.carousel').swipe({
    start: { x: 100, y: 100 },
    end: { x: 400, y: 100 },
  });
  
  await context.close();
});
```

---

## Geolocation

### Mock Geolocation

```javascript
test('Geolocation testing', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 },  // San Francisco
    permissions: ['geolocation'],
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com/map');
  
  // Page sees device in San Francisco
  
  await context.close();
});
```

---

## Device Orientation

### Test Landscape & Portrait

```javascript
test('Device orientation', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
    screen: { width: 390, height: 844 },  // Portrait
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  // Test portrait layout
  
  await context.close();
});
```

---

## Network Throttling

### Simulate Slow Network

```javascript
test('Slow network conditions', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  });
  
  const page = await context.newPage();
  
  // Simulate slow 3G
  await page.route('**/*', route => {
    setTimeout(() => route.continue(), 100);  // Add delay
  });
  
  await page.goto('https://example.com');
  
  await context.close();
});
```

---

## 🏋️ Exercises

**Exercise 1**: Create a test using iPhone 12 device emulation.

<details>
<summary>✅ Answer</summary>

```javascript
import { devices } from '@playwright/test';

test('iPhone 12 test', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  });
  const page = await context.newPage();
  await page.goto('https://example.com');
  await expect(page.locator('.mobile-menu')).toBeVisible();
  await context.close();
});
```

</details>

**Exercise 2**: Test responsive design across desktop, tablet, and mobile viewports.

<details>
<summary>✅ Answer</summary>

```javascript
import { devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  const configs = [
    { name: 'Desktop', viewport: { width: 1920, height: 1080 } },
    { name: 'iPad', ...devices['iPad Pro'] },
    { name: 'Mobile', ...devices['iPhone 12'] },
  ];
  
  configs.forEach(config => {
    test(`Layout on ${config.name}`, async ({ browser }) => {
      const context = await browser.newContext(config);
      const page = await context.newPage();
      await page.goto('https://example.com');
      await expect(page.locator('.main-content')).toBeVisible();
      await context.close();
    });
  });
});
```

</details>

**Exercise 3**: Enable geolocation and test location-based features.

<details>
<summary>✅ Answer</summary>

```javascript
import { devices } from '@playwright/test';

test('Geolocation feature', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 },
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('https://example.com/nearby');
  const location = await page.evaluate(() => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    });
  });
  expect(location.latitude).toBeCloseTo(37.7749, 2);
  await context.close();
});
```

</details>

---

## 🎤 Interview Questions

1. **What is device emulation in Playwright?**
   <details>
   <summary>Answer</summary>
   Simulating mobile device capabilities without actual device hardware
   </details>

2. **How do you test on multiple devices?**
   <details>
   <summary>Answer</summary>
   Define multiple projects in playwright.config.js with different device profiles
   </details>

3. **What are common device profiles available?**
   <details>
   <summary>Answer</summary>
   iPhone 12, iPhone 13, Pixel 5, Galaxy S9+, iPad Pro, iPad Mini, and many more
   </details>

4. **Can you override specific device settings?**
   <details>
   <summary>Answer</summary>
   Yes, spread device config and override properties like geolocation, viewport
   </details>


# 01: Introduction to Playwright

## What is Playwright?

Playwright is an **open-source automation framework** developed by Microsoft for browser automation testing. It supports multiple browsers and programming languages.

### Key Features
- **Multi-browser support**: Chromium, Firefox, WebKit
- **Multi-language**: JavaScript/TypeScript, Python, Java, .NET
- **Cross-platform**: Windows, Linux, macOS
- **Fast & reliable**: Built for modern web apps
- **Mobile emulation**: Test on mobile devices
- **Network control**: Mock APIs, intercept requests

---

## Why Use Playwright?

| Feature | Benefit |
|---------|---------|
| **Multiple Browsers** | Single API, test across all browsers |
| **Auto-wait** | Automatic waits reduce flakiness |
| **Headless & UI** | Run in background or see what's happening |
| **Powerful Selectors** | CSS, XPath, text, role-based |
| **API Testing** | Test backend & frontend together |
| **Fast** | Parallel execution, optimized |

---

## Comparison: Playwright vs Others

| Factor | Playwright | Selenium | Cypress |
|--------|-----------|----------|---------|
| **Multi-browser** | ✅ | ✅ | ❌ Chrome only |
| **Languages** | 4+ | Many | JavaScript only |
| **Speed** | Very Fast | Slower | Medium |
| **Mobile** | ✅ | ✅ | ❌ |
| **Learning Curve** | Easy | Medium | Easy |

---

## Common Use Cases

1. **E2E Testing** - Test complete user workflows
2. **Regression Testing** - Validate features after changes
3. **Performance Testing** - Measure page load, response times
4. **API Testing** - Test backend services
5. **Screenshot Testing** - Visual regression testing
6. **Load Testing** - Concurrent user simulation

---

## Terminology

- **Browser**: Chromium, Firefox, or WebKit instance
- **Page**: Single tab/window in browser
- **Context**: Isolated browser session with cookies/storage
- **Locator**: Way to find elements (selector)
- **Action**: Click, type, fill, navigate, etc.

---

## 🏋️ Exercises

**Exercise 1**: Explain why Playwright is better for multi-browser testing than Selenium.

**Exercise 2**: List 3 scenarios where you'd use Playwright in your project.

---

## 🎤 Interview Questions

1. **What is Playwright and what are its main advantages?**
   - Open-source automation framework by Microsoft supporting multiple browsers and languages

2. **What browsers does Playwright support?**
   - Chromium, Firefox, WebKit (Safari)

3. **Can you use Playwright for API testing?**
   - Yes, via APIRequestContext, can test backend services

4. **Is Playwright faster than Selenium?**
   - Yes, Playwright is significantly faster with better handling of modern web apps


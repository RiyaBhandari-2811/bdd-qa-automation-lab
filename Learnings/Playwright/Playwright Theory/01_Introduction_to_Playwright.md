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

<details>
<summary>✅ Answer</summary>

Playwright is better because:
- **Single API for multiple browsers**: Write once, test on Chromium, Firefox, WebKit without code changes
- **Built-in auto-wait**: Handles asynchronous operations automatically, reducing flaky tests
- **Modern architecture**: Designed for modern SPAs and async web apps
- **Better performance**: Faster execution than Selenium
- **Network interception**: Native support for mocking APIs and network control
- **Multiple languages**: Built-in support for JS/TS, Python, Java, .NET
- **True multi-browser**: Not just remoting but actual browser engines

</details>

**Exercise 2**: List 3 scenarios where you'd use Playwright in your project.

<details>
<summary>✅ Answer</summary>

1. **E2E Testing**: Testing complete user workflows (login → browse → checkout → logout) across all browsers
2. **Visual Regression Testing**: Taking screenshots of UI components and comparing with baselines to catch unintended visual changes
3. **Mobile & Responsive Testing**: Emulating mobile devices (iPhone, Android) to verify responsive design without physical devices

</details>

---

## 🎤 Interview Questions

1. **What is Playwright and what are its main advantages?**
   <details>
   <summary>Answer</summary>
   Open-source automation framework by Microsoft supporting multiple browsers and languages with built-in auto-wait, network interception, and mobile emulation.
   </details>

2. **What browsers does Playwright support?**
   <details>
   <summary>Answer</summary>
   Chromium, Firefox, WebKit (Safari)
   </details>

3. **Can you use Playwright for API testing?**
   <details>
   <summary>Answer</summary>
   Yes, via APIRequestContext, can test backend services without UI automation.
   </details>

4. **Is Playwright faster than Selenium?**
   <details>
   <summary>Answer</summary>
   Yes, Playwright is significantly faster with better handling of modern web apps due to modern architecture and parallel execution capabilities.
   </details>


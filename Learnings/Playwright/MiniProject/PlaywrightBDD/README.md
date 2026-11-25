# 📝 Notes App - Playwright BDD Mini Project

**Purpose:** Simple hands-on BDD testing with Playwright and Cucumber  
**Technologies:** Cucumber.js, Playwright, Gherkin  
**Complexity:** Beginner-friendly

---

## 🎯 What's Included

**4 Simple Scenarios:**
1. ✅ Create a new note
2. ✅ Add multiple notes
3. 🗑️ Delete a note
4. ✏️ Edit a note

---

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
npm install
```

### **2. Run Tests**
```bash
npm test                    # All tests
npm run test:smoke         # Quick smoke tests
npm run test:report        # Generate HTML report
```

---

## 📁 Project Structure

```
PlaywrightBDD/
├── features/
│   ├── notes.feature                    # 4 Gherkin scenarios
│   ├── step_definitions/
│   │   └── notes.steps.js               # Step implementations
│   └── support/
├── package.json
├── cucumber.js
└── README.md                            # This file
```

---

## 📚 Key Concepts

### **Feature File** (notes.feature)
```gherkin
Scenario: Create a new note
  Given I am on the Notes app
  When I click "New Note" button
  And I enter title "My First Note"
  Then the note should be saved successfully
```

**Components:**
- **Given** - Initial state/precondition
- **When** - Action user takes
- **Then** - Expected result

### **Step Definitions** (notes.steps.js)
```javascript
When('I click {string} button', async function (buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
});
```

**Maps Gherkin to Playwright code**

### **Hooks** (Setup/Teardown)
```javascript
Before(async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
});

After(async function () {
  await browser.close();
});
```

**Manages browser lifecycle**

---

## 🧪 Running Tests

### **All Tests**
```bash
npm test
```

### **Only Smoke Tests** (marked with @smoke)
```bash
npm run test:smoke
```

### **With HTML Report**
```bash
npm run test:report
open reports/report.html
```

---

## ✏️ How to Add a New Scenario

### **Step 1: Add to Feature File**
Edit `features/notes.feature`:
```gherkin
Scenario: Search notes
  Given I am on the Notes app
  When I enter search term "important"
  Then the notes should be filtered
```

### **Step 2: Add Step Definitions**
Edit `features/step_definitions/notes.steps.js`:
```javascript
When('I enter search term {string}', async function (term) {
  await this.page.fill('input[name="search"]', term);
});

Then('the notes should be filtered', async function () {
  const results = await this.page.locator('.note-card').count();
  expect(results).toBeGreaterThan(0);
});
```

### **Step 3: Run Tests**
```bash
npm test
```

---

## 🏷️ Tags

| Tag | Meaning |
|-----|---------|
| `@smoke` | Quick tests |
| `@notes` | Notes feature |

**Run by tag:**
```bash
cucumber-js --tags "@smoke"
```

---

## 🔍 Understanding the Flow

```
1. npm test
   ↓
2. Reads notes.feature (Gherkin)
   ↓
3. Finds matching steps in notes.steps.js
   ↓
4. Executes each step (Playwright code)
   ↓
5. Reports results
```

---

## 💡 Tips

✅ Read scenarios first (plain English)  
✅ Compare with step definitions (code)  
✅ Modify selectors to match your website  
✅ Add `slowMo: 500` to see actions clearly  
✅ Take screenshots on failures  

---

## 📊 Expected Output

```
Feature: Simple Notes Application

  Scenario: Create a new note
    ✓ Given I am on the Notes app
    ✓ When I click "New Note" button
    ✓ And I enter title "My First Note"
    ✓ When I click "Save" button
    ✓ Then the note should be saved successfully

  4 scenarios (4 passed)
  18 steps (18 passed)
```

---

## 🎓 Learning Path

1. **Understand Gherkin** - Read `notes.feature`
2. **Understand Steps** - Read `notes.steps.js`
3. **Run the tests** - See them work
4. **Modify a scenario** - Change a step
5. **Add a scenario** - Write your own

---

## 🚀 Next Steps

- Extend with more scenarios
- Connect to real website (change URL in steps)
- Add before/after hooks for setup
- Create additional feature files
- Integrate with CI/CD

---

**Happy Testing! 🎉**

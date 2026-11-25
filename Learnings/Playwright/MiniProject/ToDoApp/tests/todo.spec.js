import { test, expect } from '@playwright/test';

const BASE_URL = 'https://todomvc.com/examples/react/dist/';

// ==========================================
// 📚 CUSTOM FIXTURES THEORY & EXPLANATION
// ==========================================
// 
// WHAT ARE FIXTURES?
// Fixtures are reusable setup/teardown logic that runs before and after tests.
// Instead of repeating the same setup code in every test, we create a fixture once
// and reuse it everywhere.
//
// WHY USE CUSTOM FIXTURES?
// 1. DRY (Don't Repeat Yourself) - Write setup code once, use everywhere
// 2. Maintainability - Change setup logic in one place
// 3. Consistency - All tests follow the same setup
// 4. Readability - Tests focus on what they're testing, not setup
//
// HOW DO THEY WORK?
// test.extend() creates new fixtures that wrap existing fixtures (like page, context)
// 
// BASIC STRUCTURE:
// const test = base.extend({
//   myFixture: async ({ page }, use) => {
//     // SETUP CODE (runs before test)
//     await page.goto(BASE_URL);
//     
//     // USE CODE (the test runs here)
//     await use(page);
//     
//     // CLEANUP CODE (runs after test)
//     console.log('Test finished, cleaning up...');
//   }
// });
//
// USAGE IN TEST:
// test('my test', async ({ myFixture }) => {
//   // myFixture is already set up with page loaded and ready!
//   await myFixture.fill('Some text');
// });
//
// ==========================================
// 🛠️ CUSTOM FIXTURES IMPLEMENTATION
// ==========================================

// Fixture 1: todoPageReady
// What: Navigates to TodoMVC and waits for it to load
// Why: Every test needs to start at the same place. Instead of repeating goto() everywhere,
//      we create a fixture that does this automatically.
const todoTest = test.extend({
  todoPageReady: async ({ page }, use) => {
    // SETUP: Navigate to TodoMVC and wait for it to load
    console.log('🚀 Setting up: Navigating to TodoMVC...');
    await page.goto(BASE_URL);
    
    // Wait for the input field to be ready
    await page.waitForSelector('[data-testid="text-input"]');
    console.log('✓ TodoMVC loaded and ready!');
    
    // USAGE: Pass the loaded page to the test
    await use(page);
    
    // CLEANUP: Optional cleanup after test
    console.log('🧹 Cleaning up: Test completed');
  }
});

// Fixture 2: todoAppWithTasks
// What: TodoMVC loaded + pre-populated with sample todos
// Why: Many tests need to test with existing todos. Instead of adding todos in each test,
//      we do it once in a fixture.
const todoTestWithTasks = test.extend({
  todoAppWithTasks: async ({ page }, use) => {
    // SETUP: Navigate and add sample todos
    console.log('🚀 Setting up: TodoMVC with sample tasks...');
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="text-input"]');
    
    // Add 3 sample todos
    const sampleTodos = ['Learn Playwright', 'Study Gherkin', 'Master BDD'];
    for (const todo of sampleTodos) {
      await page.getByTestId('text-input').fill(todo);
      await page.getByTestId('text-input').press('Enter');
    }
    
    console.log('✓ Sample todos added!');
    
    // USAGE: Pass the loaded page with todos to the test
    await use(page);
    
    // CLEANUP: Show summary
    const todoCount = await page.getByRole('listitem').count();
    console.log(`🧹 Test completed. Final todo count: ${todoCount}`);
  }
});

// Fixture 3: performanceMetrics
// What: Measures and logs performance metrics automatically
// Why: We want to track performance without cluttering test code
const todoTestWithMetrics = test.extend({
  performanceMetrics: async ({ page }, use) => {
    const metrics = {
      startTime: Date.now(),
      pageLoadTime: 0,
      interactionTime: 0
    };
    
    // SETUP: Navigate and measure page load
    console.log('⏱️ Starting performance measurement...');
    const navigationStart = Date.now();
    await page.goto(BASE_URL);
    metrics.pageLoadTime = Date.now() - navigationStart;
    
    // USAGE: Pass page and metrics object to test
    // Test can record interaction times
    await use({ page, metrics });
    
    // CLEANUP: Print performance summary
    const totalTime = Date.now() - metrics.startTime;
    console.log('\n📊 PERFORMANCE SUMMARY:');
    console.log(`  Page Load: ${metrics.pageLoadTime}ms`);
    console.log(`  Interactions: ${metrics.interactionTime}ms`);
    console.log(`  Total Test Time: ${totalTime}ms`);
  }
});

// ==========================================
// 🎓 FIXTURE USAGE NOTES
// ==========================================
// 
// In this file, we have 3 ways to use fixtures:
// 
// 1. NORMAL TESTS (using todoTest)
//    test('my test', async ({ todoPageReady }) => { ... })
//    ✓ Page is auto-loaded at TodoMVC
//    ✓ No need for page.goto() in test
//
// 2. TESTS WITH SAMPLE DATA (using todoTestWithTasks)
//    todoTestWithTasks('my test', async ({ todoAppWithTasks: page }) => { ... })
//    ✓ Page is loaded
//    ✓ 3 sample todos already added
//    ✓ Perfect for testing filtering, completion, etc.
//
// 3. TESTS WITH PERFORMANCE (using todoTestWithMetrics)
//    todoTestWithMetrics('my test', async ({ performanceMetrics: { page, metrics } }) => { ... })
//    ✓ Page is loaded
//    ✓ Metrics are auto-tracked
//    ✓ Performance logged automatically
//
// ==========================================

// ==========================================
// 📝 SCENARIO 1: HAPPY PATH - Add and Complete Todos
// ==========================================
test('✅ Happy Path: Add multiple todos and mark as complete', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Test data
  const todos = [
    'Bring Truffle',
    'Complete Playwright course and theory',
    'Complete BDD and Gherkin theory code'
  ];

  // Add todos
  for (const todo of todos) {
    await page.getByTestId('text-input').fill(todo);
    await page.getByTestId('text-input').press('Enter');
  }

  // Verify all todos added
  for (const todo of todos) {
    await expect(page.getByRole('listitem').filter({ hasText: todo })).toBeVisible();
  }

  // Mark some as complete
  await page.getByRole('listitem').filter({ hasText: 'Complete Playwright course' }).getByTestId('todo-item-toggle').check();
  await page.getByRole('listitem').filter({ hasText: 'Bring Truffle' }).getByTestId('todo-item-toggle').check();

  // Verify 1 item remaining
  await expect(page.getByText('1 item left')).toBeVisible();

  // Clear completed
  await page.getByRole('button', { name: 'Clear completed' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Bring Truffle' })).not.toBeVisible();
});

// ==========================================
// ❌ SCENARIO 2: EDGE CASES & FAILURES
// ==========================================
test('❌ Edge Case: Empty todo submission should fail', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Try to submit empty todo
  const input = page.getByTestId('text-input');
  await input.fill('');
  await input.press('Enter');

  // Verify no todo was added
  const todos = await page.getByRole('listitem').count();
  expect(todos).toBe(0);
});

test('❌ Edge Case: Whitespace-only todo should be rejected', async ({ page }) => {
  await page.goto(BASE_URL);
  
  const input = page.getByTestId('text-input');
  
  // Try spaces only
  await input.fill('   ');
  await input.press('Enter');

  const todos = await page.getByRole('listitem').count();
  expect(todos).toBe(0);

  // Try tabs and newlines
  await input.fill('\t\n');
  await input.press('Enter');

  expect(await page.getByRole('listitem').count()).toBe(0);
});

test('❌ Edge Case: Very long todo text should be handled', async ({ page }) => {
  await page.goto(BASE_URL);
  
  const longText = 'A'.repeat(500); // 500 character todo
  
  await page.getByTestId('text-input').fill(longText);
  await page.getByTestId('text-input').press('Enter');

  // Should still be added and visible (might wrap)
  await expect(page.getByRole('listitem').filter({ hasText: 'AAAA' })).toBeVisible();
});

test('❌ Failure Case: Try to add duplicate todos', async ({ page }) => {
  await page.goto(BASE_URL);
  
  const sameTodo = 'Learn Playwright';
  
  // Add first time
  await page.getByTestId('text-input').fill(sameTodo);
  await page.getByTestId('text-input').press('Enter');
  
  let todoCount = await page.getByRole('listitem').count();
  expect(todoCount).toBe(1);

  // Add second time (duplicates allowed in TodoMVC)
  await page.getByTestId('text-input').fill(sameTodo);
  await page.getByTestId('text-input').press('Enter');
  
  todoCount = await page.getByRole('listitem').count();
  expect(todoCount).toBe(2); // Both added
});

// ==========================================
// 📱 SCENARIO 3: FILTERING & NAVIGATION
// ==========================================
test('📱 Filter todos: All, Active, Completed', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Add sample todos
  const tasks = ['Task 1', 'Task 2', 'Task 3'];
  for (const task of tasks) {
    await page.getByTestId('text-input').fill(task);
    await page.getByTestId('text-input').press('Enter');
  }

  // Complete 2 tasks
  await page.getByRole('listitem').filter({ hasText: 'Task 1' }).getByTestId('todo-item-toggle').check();
  await page.getByRole('listitem').filter({ hasText: 'Task 2' }).getByTestId('todo-item-toggle').check();

  // Test All filter
  await page.getByRole('link', { name: 'All' }).click();
  expect(await page.getByRole('listitem').count()).toBe(3);

  // Test Active filter
  await page.getByRole('link', { name: 'Active' }).click();
  expect(await page.getByRole('listitem').count()).toBe(1);
  await expect(page.getByRole('listitem').filter({ hasText: 'Task 3' })).toBeVisible();

  // Test Completed filter
  await page.getByRole('link', { name: 'Completed' }).click();
  expect(await page.getByRole('listitem').count()).toBe(2);
});

// ==========================================
// 🎥 SCENARIO 4: SCREENSHOTS & VIDEOS
// ==========================================
test('🎥 Screenshots: Capture state at different stages', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Screenshot 1: Empty state
  await page.screenshot({ path: 'screenshots/01_empty-state.png' });

  // Add todos
  await page.getByTestId('text-input').fill('Screenshot Test 1');
  await page.getByTestId('text-input').press('Enter');
  
  // Screenshot 2: One todo added
  await page.screenshot({ path: 'screenshots/02_one-todo.png' });

  await page.getByTestId('text-input').fill('Screenshot Test 2');
  await page.getByTestId('text-input').press('Enter');
  
  // Screenshot 3: Two todos added
  await page.screenshot({ path: 'screenshots/03_two-todos.png' });

  // Mark one as done
  await page.getByRole('listitem').filter({ hasText: 'Screenshot Test 1' }).getByTestId('todo-item-toggle').check();
  
  // Screenshot 4: One completed
  await page.screenshot({ path: 'screenshots/04_one-completed.png' });
});

// ==========================================
// 🔍 SCENARIO 5: NETWORK INTERCEPTION & MOCKING
// ==========================================
test('🔍 Network: Track all network requests', async ({ page }) => {
  const requests = [];
  const responses = [];

  // Monitor all requests
  page.on('request', (req) => {
    requests.push({
      url: req.url(),
      method: req.method(),
      time: new Date().toISOString()
    });
  });

  // Monitor all responses
  page.on('response', (res) => {
    responses.push({
      url: res.url(),
      status: res.status(),
      time: new Date().toISOString()
    });
  });

  await page.goto(BASE_URL);

  // Verify network traffic captured
  console.log('📊 Network Summary:');
  console.log(`Requests: ${requests.length}`);
  console.log(`Responses: ${responses.length}`);
  
  // Log some details
  requests.slice(0, 3).forEach(req => {
    console.log(`  → ${req.method} ${req.url}`);
  });

  expect(requests.length).toBeGreaterThan(0);
});

// ==========================================
// ⏱️ SCENARIO 6: PERFORMANCE TESTING
// ==========================================
test('⏱️ Performance: Measure page load time', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto(BASE_URL);
  
  const loadTime = Date.now() - startTime;
  
  console.log(`⏱️ Page load time: ${loadTime}ms`);
  
  // Should load within reasonable time
  expect(loadTime).toBeLessThan(5000);

  // Measure interaction performance
  const interactionStart = Date.now();
  
  await page.getByTestId('text-input').fill('Performance Test');
  await page.getByTestId('text-input').press('Enter');
  
  const interactionTime = Date.now() - interactionStart;
  
  console.log(`⏱️ Add todo time: ${interactionTime}ms`);
  expect(interactionTime).toBeLessThan(2000);
});

// ==========================================
// 🎯 SCENARIO 7: WAIT PATTERNS & SYNCHRONIZATION
// ==========================================
test('🎯 Waits: Different wait strategies', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // 1. Wait for selector
  await page.waitForSelector('[data-testid="text-input"]');
  
  await page.getByTestId('text-input').fill('Wait Test 1');
  await page.getByTestId('text-input').press('Enter');

  // 2. Wait for specific text
  await page.getByRole('listitem').filter({ hasText: 'Wait Test 1' }).waitFor();
  
  // 3. Wait for element to be visible
  await expect(page.getByRole('listitem').filter({ hasText: 'Wait Test 1' })).toBeVisible();

  // 4. Wait with timeout
  await page.waitForTimeout(500);

  // 5. Wait for function condition
  await page.waitForFunction(() => {
    return document.querySelectorAll('.todo-list li').length > 0;
  });

  console.log('✓ All wait patterns executed successfully');
});

// ==========================================
// 📊 SCENARIO 8: DATA-DRIVEN TESTING
// ==========================================
test.describe('📊 Data-Driven: Multiple todo scenarios', () => {
  const testCases = [
    { 
      name: 'Simple task', 
      todo: 'Buy milk',
      description: 'Single word todo'
    },
    { 
      name: 'Task with numbers', 
      todo: 'Complete 3 learning modules',
      description: 'Todo with numbers'
    },
    { 
      name: 'Task with special chars', 
      todo: 'Fix bug #123 @urgent!',
      description: 'Todo with special characters'
    },
    { 
      name: 'Task with emoji', 
      todo: '🎯 Complete Playwright',
      description: 'Todo with emoji'
    }
  ];

  testCases.forEach(testCase => {
    test(`Add: ${testCase.name}`, async ({ page }) => {
      await page.goto(BASE_URL);
      
      await page.getByTestId('text-input').fill(testCase.todo);
      await page.getByTestId('text-input').press('Enter');
      
      // Verify added
      await expect(page.getByRole('listitem')).toContainText(testCase.todo.substring(0, 10));
      
      console.log(`✓ ${testCase.description}`);
    });
  });
});

// ==========================================
// 🐛 SCENARIO 9: ERROR HANDLING & RECOVERY
// ==========================================
test('🐛 Error Handling: Page refresh mid-operation', async ({ page }) => {
  await page.goto(BASE_URL);

  // Add first todo
  await page.getByTestId('text-input').fill('Before Refresh');
  await page.getByTestId('text-input').press('Enter');

  // Verify it's added
  await expect(page.getByRole('listitem').filter({ hasText: 'Before Refresh' })).toBeVisible();

  // Refresh page
  await page.reload();

  // Verify todo persists (TodoMVC uses localStorage)
  await expect(page.getByRole('listitem').filter({ hasText: 'Before Refresh' })).toBeVisible();

  console.log('✓ Todo persisted after page refresh');
});

test('🐛 Error Handling: Try operations on non-existent element', async ({ page }) => {
  await page.goto(BASE_URL);

  try {
    // Try to click non-existent element with timeout
    await page.getByRole('listitem').filter({ hasText: 'NonExistent' }).click({ timeout: 1000 });
  } catch (error) {
    console.log(`✓ Caught error: ${error.message.substring(0, 50)}...`);
  }

  // Verify page is still functional
  await page.getByTestId('text-input').fill('Recovery Test');
  await page.getByTestId('text-input').press('Enter');
  
  await expect(page.getByRole('listitem').filter({ hasText: 'Recovery Test' })).toBeVisible();
});

// ==========================================
// 🔐 SCENARIO 10: CONSOLE & BROWSER EVENTS
// ==========================================
test('🔐 Console: Monitor console messages', async ({ page }) => {
  const consoleLogs = [];
  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', (msg) => {
    if (msg.type() === 'log') {
      consoleLogs.push(msg.text());
    } else if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  await page.goto(BASE_URL);

  // Perform actions
  await page.getByTestId('text-input').fill('Console Monitor Test');
  await page.getByTestId('text-input').press('Enter');

  console.log(`📋 Console logs captured: ${consoleLogs.length}`);
  console.log(`⚠️ Console warnings: ${consoleWarnings.length}`);
  console.log(`❌ Console errors: ${consoleErrors.length}`);

  // Verify no console errors
  expect(consoleErrors.length).toBe(0);
});

// ==========================================
// 🎭 SCENARIO 11: MULTIPLE ASSERTIONS
// ==========================================
test('🎭 Multiple Assertions: Comprehensive validation', async ({ page }) => {
  await page.goto(BASE_URL);

  // Add todos
  const todo1 = 'Assertion Test 1';
  const todo2 = 'Assertion Test 2';

  await page.getByTestId('text-input').fill(todo1);
  await page.getByTestId('text-input').press('Enter');
  
  await page.getByTestId('text-input').fill(todo2);
  await page.getByTestId('text-input').press('Enter');

  // Multiple assertions
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await expect(page.getByTestId('todo-list')).toContainText(todo1);
  await expect(page.getByTestId('todo-list')).toContainText(todo2);
  await expect(page.getByText('2 items left')).toBeVisible();

  // Complete one
  await page.getByRole('listitem').filter({ hasText: todo1 }).getByTestId('todo-item-toggle').check();

  // More assertions
  await expect(page.getByText('1 item left')).toBeVisible();
  
  const completed = await page.getByRole('listitem').filter({ hasText: todo1 });
  const checkbox = completed.getByTestId('todo-item-toggle');
  
  await expect(checkbox).toBeChecked();

  console.log('✓ All assertions passed');
});

// ==========================================
// 📋 SCENARIO 12: TRACING FOR DEBUGGING
// ==========================================
test('📋 Trace: Enable tracing for debugging', async ({ page, context }) => {
  // Start recording trace
  await context.tracing.start({ screenshots: true, snapshots: true });

  await page.goto(BASE_URL);

  // Perform operations
  await page.getByTestId('text-input').fill('Trace Debug Test');
  await page.getByTestId('text-input').press('Enter');

  await page.getByRole('listitem').filter({ hasText: 'Trace Debug Test' }).getByTestId('todo-item-toggle').check();

  // Stop tracing
  await context.tracing.stop({ path: 'trace.zip' });

  console.log('✓ Trace recorded in trace.zip');
});

// ==========================================
// 🛠️ PRACTICAL FIXTURE EXAMPLES
// ==========================================
// These tests demonstrate how to use the custom fixtures we created above

// Example 1: Using todoPageReady fixture
// ✨ Notice: No page.goto() needed! Fixture handles it.
todoTest('🛠️ FIXTURE DEMO 1: Auto-loaded Page', async ({ todoPageReady }) => {
  console.log('📌 This test uses todoPageReady fixture');
  console.log('✓ Page was automatically navigated to TodoMVC by fixture');
  console.log('✓ We can skip the goto() and go straight to testing\n');
  
  // Because of the fixture, page is ALREADY at TodoMVC and ready
  // We can immediately add a todo without any setup
  await todoPageReady.getByTestId('text-input').fill('Fixture Test 1');
  await todoPageReady.getByTestId('text-input').press('Enter');
  
  await expect(todoPageReady.getByRole('listitem').filter({ hasText: 'Fixture Test 1' })).toBeVisible();
  
  console.log('✓ Test passed! Fixture made setup super clean.');
});

// Example 2: Using todoAppWithTasks fixture
// ✨ Notice: 3 todos already exist! No need to add them.
todoTestWithTasks('🛠️ FIXTURE DEMO 2: Pre-populated Todos', async ({ todoAppWithTasks: page }) => {
  console.log('\n📌 This test uses todoAppWithTasks fixture');
  console.log('✓ 3 sample todos were already added by fixture');
  console.log('✓ We can go straight to testing filters, completion, etc.\n');
  
  // Fixture already added: 'Learn Playwright', 'Study Gherkin', 'Master BDD'
  // We can verify they exist
  await expect(page.getByRole('listitem').filter({ hasText: 'Learn Playwright' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Study Gherkin' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Master BDD' })).toBeVisible();
  
  console.log('✓ All pre-populated todos are visible!');
  
  // Now let's test filtering with these todos
  await page.getByRole('listitem').filter({ hasText: 'Learn Playwright' }).getByTestId('todo-item-toggle').check();
  await page.getByRole('link', { name: 'Active' }).click();
  
  const activeTodoCount = await page.getByRole('listitem').count();
  console.log(`✓ After completing 1 todo, ${activeTodoCount} active todos remain`);
});

// Example 3: Using todoAppWithTasks to test deletion
todoTestWithTasks('🛠️ FIXTURE DEMO 3: Clear Completed with Pre-populated Data', async ({ todoAppWithTasks: page }) => {
  console.log('\n📌 This test shows how fixtures save setup time');
  console.log('✓ 3 todos already exist, so we focus on the actual test\n');
  
  // Complete 2 todos
  await page.getByRole('listitem').filter({ hasText: 'Learn Playwright' }).getByTestId('todo-item-toggle').check();
  await page.getByRole('listitem').filter({ hasText: 'Study Gherkin' }).getByTestId('todo-item-toggle').check();
  
  // Verify 1 item left
  await expect(page.getByText('1 item left')).toBeVisible();
  console.log('✓ 2 todos completed, 1 remains');
  
  // Clear completed
  await page.getByRole('button', { name: 'Clear completed' }).click();
  
  // Verify only uncompleted todo remains
  await expect(page.getByRole('listitem').filter({ hasText: 'Master BDD' })).toBeVisible();
  const finalCount = await page.getByRole('listitem').count();
  console.log(`✓ After clear completed, ${finalCount} todo remains`);
});

// Example 4: Using performanceMetrics fixture
// ✨ Notice: Metrics are auto-tracked and logged at the end
todoTestWithMetrics('🛠️ FIXTURE DEMO 4: Auto Performance Tracking', async ({ performanceMetrics: { page, metrics } }) => {
  console.log('\n📌 This test uses performanceMetrics fixture');
  console.log('✓ Performance is automatically tracked\n');
  
  // Record interaction start time
  const interactionStart = Date.now();
  
  // Perform actions
  await page.getByTestId('text-input').fill('Performance Test');
  await page.getByTestId('text-input').press('Enter');
  
  // Record interaction time
  metrics.interactionTime = Date.now() - interactionStart;
  
  // Verify todo added
  await expect(page.getByRole('listitem').filter({ hasText: 'Performance Test' })).toBeVisible();
  
  console.log(`✓ Interaction completed in ${metrics.interactionTime}ms`);
  // Fixture will automatically print performance summary at end
});

// Example 5: Combining fixtures benefit - Multiple tests reuse same setup
// This shows why fixtures are powerful for DRY principle
todoTestWithTasks('🛠️ FIXTURE DEMO 5A: Test Filtering', async ({ todoAppWithTasks: page }) => {
  console.log('\n📌 Test 5A: Filtering (reusing fixture setup)\n');
  
  // All 3 todos exist, test filtering
  await page.getByRole('link', { name: 'Active' }).click();
  const activeCount = await page.getByRole('listitem').count();
  console.log(`✓ Active view shows ${activeCount} todos`);
});

todoTestWithTasks('🛠️ FIXTURE DEMO 5B: Test Adding More', async ({ todoAppWithTasks: page }) => {
  console.log('\n📌 Test 5B: Adding more (reusing fixture setup)\n');
  
  // All 3 todos exist, add one more
  await page.getByTestId('text-input').fill('Fourth Task');
  await page.getByTestId('text-input').press('Enter');
  
  const totalCount = await page.getByRole('listitem').count();
  console.log(`✓ After adding, total todos: ${totalCount}`);
});

todoTestWithTasks('🛠️ FIXTURE DEMO 5C: Test Completion', async ({ todoAppWithTasks: page }) => {
  console.log('\n📌 Test 5C: Completion (reusing fixture setup)\n');
  
  // All 3 todos exist, complete all and verify
  const todos = await page.getByRole('listitem').all();
  for (const todo of todos) {
    await todo.getByTestId('todo-item-toggle').check();
  }
  
  await page.getByRole('link', { name: 'Active' }).click();
  const activeCount = await page.getByRole('listitem').count();
  console.log(`✓ After completing all, active count: ${activeCount}`);
});

// ==========================================
// 📊 FIXTURE BENEFITS SUMMARY
// ==========================================
//
// Look at the 5 fixture demo tests above. Notice:
//
// ✅ BENEFIT 1: DRY (Don't Repeat Yourself)
//    Without fixtures:
//    ```
//    test('test 1', async ({ page }) => {
//      await page.goto(BASE_URL); // Repeated
//      await page.waitForSelector('[data-testid="text-input"]'); // Repeated
//      // Add 3 todos // Repeated
//      // Test logic
//    });
//    test('test 2', async ({ page }) => {
//      await page.goto(BASE_URL); // Repeated
//      await page.waitForSelector('[data-testid="text-input"]'); // Repeated
//      // Add 3 todos // Repeated
//      // Test logic
//    });
//    ```
//    With fixtures:
//    ```
//    todoTestWithTasks('test 1', async ({ todoAppWithTasks: page }) => {
//      // Test logic (setup auto-handled!)
//    });
//    todoTestWithTasks('test 2', async ({ todoAppWithTasks: page }) => {
//      // Test logic (same setup auto-handled!)
//    });
//    ```
//
// ✅ BENEFIT 2: Consistency
//    Every test using todoAppWithTasks gets exactly the same setup.
//    No variations, no mistakes.
//
// ✅ BENEFIT 3: Easy Maintenance
//    If we need to change setup (e.g., add 5 todos instead of 3),
//    we change it in ONE place (the fixture), and all tests benefit.
//
// ✅ BENEFIT 4: Readable Tests
//    Test code focuses on WHAT is being tested, not HOW to set it up.
//    Much cleaner and easier to understand.
//
// ✅ BENEFIT 5: Reusable Setup/Teardown
//    Fixtures automatically handle cleanup after tests.
//    No need to remember to clean up in every test.
//
// ==========================================
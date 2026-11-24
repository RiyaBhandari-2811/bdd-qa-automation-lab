# Testing Fundamentals, Test Pyramid, BDD & TDD

**Learning track:** ShopSure | **Week 1:** 23–29 November 2026  
**Purpose:** Understand software testing fundamentals before building a full-stack e-commerce application and its QA automation platform.

---

## Table of Contents

1. [Learning outcomes](#1-learning-outcomes)
2. [What is software testing?](#2-what-is-software-testing)
3. [Why do we test?](#3-why-do-we-test)
4. [Core testing principles](#4-core-testing-principles)
5. [Verification vs validation](#5-verification-vs-validation)
6. [Testing levels](#6-testing-levels)
7. [Testing types](#7-testing-types)
8. [The test pyramid](#8-the-test-pyramid)
9. [BDD: Behavior-Driven Development](#9-bdd-behavior-driven-development)
10. [Gherkin fundamentals](#10-gherkin-fundamentals)
11. [TDD: Test-Driven Development](#11-tdd-test-driven-development)
12. [BDD vs TDD](#12-bdd-vs-tdd)
13. [How these ideas fit ShopSure](#13-how-these-ideas-fit-shopsure)
14. [Common testing terminology](#14-common-testing-terminology)
15. [Interview questions and practice answers](#15-interview-questions-and-practice-answers)
16. [Practical exercises](#16-practical-exercises)
17. [Knowledge checklist](#17-knowledge-checklist)
18. [Suggested learning order and references](#18-suggested-learning-order-and-references)

---

## 1. Learning outcomes

After studying these notes, you should be able to:

- Explain what software testing is and why teams invest in it.
- Distinguish verification, validation, testing levels and testing types.
- Explain the test pyramid and choose an appropriate test level.
- Explain BDD, Gherkin, feature files and executable scenarios.
- Explain TDD and its Red–Green–Refactor cycle.
- Compare BDD and TDD without treating them as competing tools.
- Describe how these concepts apply to a Next.js + Spring Boot + PostgreSQL + Python AI application.

## 2. What is software testing?

Software testing is the process of evaluating software to find defects and check whether it behaves as expected.

A **test** sets up a condition, performs an action, and checks the actual result against an expected result.

Example: ShopSure should not allow a customer to place an order when the cart is empty.

- **Precondition:** The customer has an empty cart.
- **Action:** The customer selects Checkout.
- **Expected result:** The application prevents checkout and displays a useful message.
- **Actual result:** What the application really does when the test runs.

A **defect/bug** is a flaw in the software. A **failure** is the observable incorrect behavior when that flaw is triggered. A test can reveal a failure; debugging investigates its cause.

### Test case vs test scenario

- **Test scenario:** A high-level condition or behavior to verify, such as “A customer can place an order with valid items.”
- **Test case:** Specific steps, inputs, preconditions and expected results for checking that behavior.

Teams sometimes use these terms differently, so clarify the team's conventions.

## 3. Why do we test?

Testing helps teams:

1. Find defects before users encounter them.
2. Prevent regressions when existing code changes.
3. Verify that services and components work together.
4. Protect critical business workflows such as checkout and payment.
5. Make releases safer and provide evidence that expected behavior was checked.
6. Document expected behavior in a form that developers, QA and product stakeholders can discuss.

Testing does **not** prove that software is completely defect-free. It reduces risk by checking selected behaviors under selected conditions.

## 4. Core testing principles

These widely used principles are commonly summarized as follows:

1. **Testing shows the presence of defects, not their absence.** Passing tests cannot prove that no bugs exist.
2. **Exhaustive testing is impossible.** It is usually impractical to test every input and every path. Prioritize risk and important boundaries.
3. **Test early.** Finding problems earlier in development often makes them cheaper to fix.
4. **Defects cluster.** A small number of modules often contain a large share of defects. Focus attention using defect history and risk.
5. **Pesticide paradox.** Repeating the same tests eventually finds fewer new defects. Review and improve the test suite.
6. **Testing is context-dependent.** A medical system, a shopping site and a video game need different testing strategies.
7. **Absence-of-errors fallacy.** Software can have few technical defects and still fail if it does not solve the user's actual problem.

## 5. Verification vs validation

| Concept | Main question | Example |
|---|---|---|
| Verification | Are we building the product correctly according to its specifications? | Does the checkout API follow the agreed API contract? |
| Validation | Are we building the right product for the user's needs? | Can a customer successfully complete the purchase they intended? |

A useful memory aid:

- **Verification:** Conformance to specified requirements.
- **Validation:** Fitness for intended use.

Both matter. A technically correct checkout implementation can still be confusing or unsuitable for customers.

## 6. Testing levels

Testing levels describe **where or at what scope** software is tested.

### 6.1 Unit testing

Tests a small unit of code in isolation, usually a function, method or class.

**ShopSure example:** Test a Java `CartCalculator` method that calculates subtotal and discount.

- Usually fast.
- Often uses mocks or stubs for dependencies.
- Helps pinpoint logic defects.
- Does not prove that the database, network or other services work.

### 6.2 Integration testing

Checks whether two or more components work together correctly.

**ShopSure examples:**
- Spring Boot order service writes an order to PostgreSQL.
- Spring Boot calls the Python AI service through its HTTP API.
- A repository query correctly reads persisted product data.

Integration tests may use real dependencies, containers, test databases or controlled substitutes. Choose based on what the test is intended to prove.

### 6.3 System testing

Tests the complete integrated application as a system against its requirements.

**ShopSure example:** Run the deployed application stack and verify that a customer can browse products, add an item to the cart and place an order.

### 6.4 Acceptance testing

Checks whether the system meets business or user acceptance criteria.

**ShopSure example:** A business stakeholder confirms that the checkout workflow meets the agreed rules for shipping, totals and order confirmation.

Acceptance testing can be manual or automated. User Acceptance Testing (UAT) is one common form.

## 7. Testing types

Testing types describe **what characteristic or behavior** is being checked. They are not all separate testing levels; a test at a given level can cover several types.

### Functional testing

Checks what the system does against functional requirements.

Examples:
- Valid login succeeds.
- Invalid coupon is rejected.
- An order is created with the correct items and total.

### Non-functional testing

Checks qualities such as performance, security, accessibility, reliability and usability.

Examples:
- Product search responds within an agreed performance target.
- Users cannot view another customer's order.
- Checkout is usable with keyboard navigation.

### Regression testing

Re-runs tests to check that a code change has not broken existing behavior.

Example: After changing discount logic, verify that normal checkout, coupon checkout and order totals still work.

### Smoke testing

A small set of high-priority checks to determine whether a build or environment is stable enough for deeper testing.

Example: Application starts, login works, products load and a basic checkout path is available.

### Sanity testing

A focused check that a particular change or fix behaves as expected.

Example: After fixing coupon validation, quickly check valid and invalid coupon behavior.

### Exploratory testing

A tester learns the application, designs tests and investigates behavior while testing, rather than following only a pre-written script.

### Positive / happy-path testing

Checks expected behavior with valid inputs and normal conditions.

Example: Customer enters valid details and places an order successfully.

### Negative testing

Checks how the application behaves with invalid inputs, missing data, unauthorized actions or unexpected conditions.

Example: Customer attempts checkout with an expired coupon or an empty cart.

### Boundary-value testing

Checks values at and around limits, where defects commonly occur.

Example: If quantity must be between 1 and 10, test 0, 1, 10 and 11.

### Performance testing

Evaluates responsiveness, throughput, resource use and behavior under load. Load, stress and endurance testing are related forms.

### Security testing

Checks authentication, authorization, data exposure, input handling and other security risks.

## 8. The test pyramid

The test pyramid is a strategy for balancing automated tests. It encourages many fast, focused tests at lower levels and fewer broad, slower tests at higher levels.

```text
                 /\
                /  \
               / E2E\       Few: complete user journeys
              /------\
             / System \     Some: whole-system behavior
            /----------\
           /Integration \   More: component interactions
          /--------------\
         /   Unit tests   \ Many: fast, isolated checks
        /__________________\
```

### Layers at a glance

| Layer | What it checks | Typical speed | Example in ShopSure |
|---|---|---|---|
| Unit | One small unit in isolation | Fastest | Discount calculation |
| Integration | Components/dependencies together | Medium | Order service + PostgreSQL |
| System / API | A larger integrated application or service | Medium to slower | Product and checkout APIs |
| End-to-end (E2E) | A user journey through the application | Usually slowest | Browser checkout journey |

The exact pyramid varies by architecture and team. Some teams combine system and E2E tests or use a testing trophy instead. The important idea is to avoid relying only on slow, brittle UI tests.

### Why not test everything through the UI?

A UI test may involve browser startup, page rendering, network requests, backend logic and database operations. When it fails, the cause can be harder to isolate. A unit test can check a calculation directly and quickly.

Use the lowest level that can reliably prove the behavior. Keep E2E tests for critical journeys and cross-system confidence.

### Practical allocation

Do not treat a fixed percentage as a universal rule. A useful starting strategy is:

- Many unit tests for business logic and edge cases.
- A healthy set of integration tests for database, messaging and service boundaries.
- A smaller set of E2E tests for critical customer journeys.

## 9. BDD: Behavior-Driven Development

**Behavior-Driven Development (BDD)** is a collaborative approach in which a team describes expected software behavior using examples that stakeholders can understand. Those examples can be connected to automated tests.

BDD encourages product/business stakeholders, developers and testers to agree on examples before or during implementation.

### Example: ShopSure checkout

Business requirement: A customer with an available item in their cart can place an order using valid delivery details.

A BDD scenario might be:

```gherkin
Feature: Checkout

  Scenario: Customer places an order successfully
    Given a customer has an available product in their cart
    And the customer has valid delivery details
    When the customer confirms the order
    Then an order should be created
    And the customer should see an order confirmation
```

The scenario is readable documentation. It becomes an **automated test only when a BDD runner connects its steps to executable step definitions and the test is run**.

### BDD workflow

1. Discuss a business requirement.
2. Identify concrete examples and edge cases.
3. Write scenarios in a shared language such as Gherkin.
4. Implement step definitions that connect scenario steps to test code.
5. Run scenarios using a BDD framework.
6. Review failures and reports, then refine behavior and tests.

This collaboration is sometimes called the **Three Amigos**: business/product, development and testing perspectives. It is a practice, not a requirement to have exactly three people.

### Why use BDD?

- Makes expected behavior explicit.
- Helps uncover ambiguous requirements early.
- Creates a shared vocabulary across roles.
- Can produce executable, maintainable acceptance-level checks.
- Keeps scenarios connected to actual test results when implemented well.

### What BDD is not

- BDD is not a programming language.
- BDD is not the same as Gherkin.
- BDD is not a test automation tool by itself.
- Writing Given/When/Then documentation does not automatically make it executable.
- BDD does not mean every test must be written as a UI test.

## 10. Gherkin fundamentals

**Gherkin** is a human-readable, structured language used to write behavior scenarios. It is commonly used with Cucumber and related BDD tooling.

### Common keywords

| Keyword | Purpose |
|---|---|
| `Feature` | Describes a capability or feature |
| `Scenario` | Describes one example of behavior |
| `Given` | Establishes initial context or preconditions |
| `When` | Describes an action or event |
| `Then` | Describes the expected outcome |
| `And` / `But` | Adds another step of the same kind |
| `Background` | Defines shared setup steps for scenarios in a feature |
| `Scenario Outline` | Runs one scenario template with multiple data sets |
| `Examples` | Supplies data rows for a Scenario Outline |
| `Rule` | Groups scenarios under a business rule |
| `@tag` | Labels features or scenarios for selection and organization |

### Scenario Outline example

```gherkin
Feature: Coupon validation

  Scenario Outline: Customer applies a coupon
    Given the customer has a cart worth <amount>
    When the customer applies coupon "<coupon>"
    Then the discount result should be "<result>"

    Examples:
      | amount | coupon | result  |
      | 1000   | SAVE10 | applied |
      | 1000   | BAD123 | rejected |
```

A Scenario Outline runs the template once for each row in `Examples`.

### Tags example

```gherkin
@checkout @smoke
Scenario: Customer places an order
  Given ...
  When ...
  Then ...
```

Tags are labels. The runner or build configuration decides how to select them. A tag does not automatically make a scenario run in a PR or nightly pipeline.

### Feature files and step definitions

- A **feature file** contains Gherkin scenarios, commonly using the `.feature` extension.
- A **step definition** is code that matches a Gherkin step and performs the required test action or assertion.
- A **runner/configuration** discovers feature files, loads step definitions and executes selected scenarios.

Illustrative Java step definition:

```java
@Given("a customer has an available product in their cart")
public void customerHasProductInCart() {
    // Arrange test data or call the required test setup
}
```

The actual annotation imports and setup depend on the Cucumber version and test framework.

## 11. TDD: Test-Driven Development

**Test-Driven Development (TDD)** is a development technique in which a developer writes a small automated test before implementing the corresponding production code.

### Red–Green–Refactor

```text
RED  ->  GREEN  ->  REFACTOR
 |         |           |
Write    Implement   Improve code
a test   minimum     while keeping
that     code to     tests passing
fails    pass
   ^___________________|
        Repeat
```

1. **Red:** Write a test for a behavior that is not implemented yet. Run it and confirm it fails for the expected reason.
2. **Green:** Write the simplest production code that makes the test pass.
3. **Refactor:** Improve the code structure without changing behavior. Run the tests again.
4. Repeat in small increments.

### Example: discount calculation

Requirement: A cart total of INR 1,000 receives a 10% discount.

First write a test:

```java
@Test
void appliesTenPercentDiscount() {
    DiscountCalculator calculator = new DiscountCalculator();

    BigDecimal result = calculator.applyDiscount(
        new BigDecimal("1000.00"),
        new BigDecimal("10")
    );

    assertEquals(new BigDecimal("900.00"), result);
}
```

The test initially fails because the implementation may not exist. Then implement the smallest correct calculation and refactor if needed.

### Benefits of TDD

- Encourages small, testable units and clear interfaces.
- Provides rapid feedback while coding.
- Helps catch regressions.
- Can improve design by exposing awkward dependencies.
- Produces tests alongside implementation.

### Common TDD mistakes

- Writing a test that passes immediately without proving the intended behavior.
- Writing a large batch of tests before any implementation and calling it TDD.
- Testing private implementation details instead of observable behavior.
- Making production code overly complicated just to satisfy a test.
- Skipping refactoring and accumulating duplication.

## 12. BDD vs TDD

| Aspect | BDD | TDD |
|---|---|---|
| Main focus | Expected behavior and shared understanding | Correct implementation through short test-first cycles |
| Typical perspective | Product, business, developers and testers | Primarily developers |
| Typical language | Readable examples, often Gherkin | Code-based tests |
| Typical scope | Often feature or acceptance behavior; can be used at other levels | Often unit-level, but not limited to unit tests |
| Main question | What should the system do? | What code do I need to write to satisfy this behavior? |
| Common tools | Cucumber, playwright-bdd, pytest-bdd | JUnit, Jest, pytest, etc. |

**They complement each other.** A team can use BDD to agree on checkout behavior and TDD to implement the discount calculation that supports it.

## 13. How these ideas fit ShopSure

Your practice application has:

- **Frontend:** Next.js + TypeScript
- **Backend:** Java + Spring Boot
- **Database:** PostgreSQL
- **AI service:** Python + FastAPI, for a shopping assistant
- **QA automation:** BDD scenarios and automated tests across the stack

A sensible starting test strategy:

| Area | What to test | Possible approach/tool |
|---|---|---|
| Frontend logic | Formatting, validation and small UI logic | Unit tests with a suitable JS/TS test runner |
| Browser behavior | Product browsing, cart and checkout | Playwright |
| Readable browser scenarios | Gherkin-driven browser journeys | Playwright + playwright-bdd |
| Spring Boot logic | Service and domain rules | JUnit |
| Spring Boot + database | Repository and API integration | Spring Boot Test, Testcontainers |
| Java BDD scenarios | Business-readable service scenarios | Cucumber-JVM |
| Python AI service | API, retrieval and response behavior | pytest |
| Python BDD scenarios | Gherkin-driven Python checks, if useful | pytest-bdd |
| Whole application | Critical journey across running services | Playwright E2E + Docker Compose |
| Automation in CI | Run tests on pull requests and on a schedule | GitHub Actions |

These are candidate tools, not a requirement to use every tool for every test. Keep the first implementation small and avoid duplicating the same scenario across frameworks without a clear reason.

### Example end-to-end workflow

1. A customer opens ShopSure in the browser.
2. The customer adds an available product to the cart.
3. The customer submits valid delivery details.
4. Next.js calls the Spring Boot checkout API.
5. Spring Boot validates the request and stores the order in PostgreSQL.
6. The UI displays the order confirmation.
7. A Playwright BDD scenario verifies the user-visible behavior.
8. Separate Spring Boot integration tests verify persistence and backend behavior.

The Python chatbot can have its own tests for API validation, retrieval behavior and safe fallback responses. It should be tested at its own service boundary rather than inserted into checkout just to make the architecture look more complex.

## 14. Common testing terminology

| Term | Meaning |
|---|---|
| Happy path | Expected flow with valid inputs and normal conditions |
| Negative scenario | Checks invalid input or an unsuccessful path |
| Edge case | Unusual or extreme condition that may expose a defect |
| Assertion | A check that compares actual and expected results |
| Fixture | Reusable setup or test data/environment |
| Mock | A test double that can simulate behavior and verify interactions |
| Stub | A test double that supplies predefined responses |
| Test data | Inputs and records used during testing |
| Test suite | A collection of related tests |
| Test runner | Tool that discovers and executes tests |
| Test report | Results such as passed, failed, skipped and duration |
| Flaky test | Test that passes and fails inconsistently without a relevant code change |
| Regression | A previously working behavior breaks after a change |
| Coverage | A measure of which code or conditions are exercised by tests |
| CI | Continuous Integration: automatically build and test changes |
| CD | Continuous Delivery or Deployment, depending on context |
| E2E | End-to-end: tests a complete user journey across system boundaries |
| Test environment | The configured application and dependencies where tests run |
| Test double | Generic term for a mock, stub, fake or other replacement used in tests |

### Mock vs stub vs fake

- **Stub:** Returns controlled data. Example: AI service returns a fixed answer.
- **Mock:** Lets a test verify an interaction. Example: verify that the order service called a payment gateway once.
- **Fake:** A lightweight working implementation. Example: an in-memory repository used instead of a production database.

Terminology can vary between testing libraries and teams. Use the distinction that your team documents.

## 15. Interview questions and practice answers

Try answering each question aloud before reading the suggested answer. The answers are starting points; explain them in your own words and add an example from ShopSure.

### Fundamentals

**1. What is software testing?**

Software testing evaluates an application or component to identify defects and verify that actual behavior matches expected behavior. It helps reduce risk, improve quality and provide confidence in changes.

**2. Why is testing important if developers have already reviewed the code?**

Code review helps identify design, logic and maintainability issues, but it cannot reliably exercise every runtime path or dependency interaction. Automated and exploratory testing provide additional evidence that the software behaves as expected.

**3. What is the difference between a test scenario and a test case?**

A scenario describes a high-level behavior to verify. A test case provides the specific preconditions, data, actions and expected results used to verify it.

**4. What is the difference between verification and validation?**

Verification checks whether the implementation conforms to specified requirements. Validation checks whether the product meets the intended user need.

**5. Can testing prove that an application has no bugs?**

No. Testing can show that defects exist, but passing a finite set of tests cannot prove that all defects are absent. It provides evidence and reduces risk.

### Levels and types

**6. Explain unit, integration, system and acceptance testing.**

Unit testing checks a small component in isolation. Integration testing checks interactions between components or dependencies. System testing checks the integrated application as a whole. Acceptance testing checks whether the solution meets business or user acceptance criteria.

**7. What is the difference between functional and non-functional testing?**

Functional testing checks what the system does, such as creating an order. Non-functional testing checks qualities such as performance, security, accessibility and reliability.

**8. What is regression testing?**

Regression testing re-runs relevant tests after a change to check that previously working functionality still behaves correctly.

**9. What is smoke testing?**

Smoke testing runs a small set of critical checks to determine whether a build or environment is stable enough for more detailed testing.

**10. What is the difference between smoke and sanity testing?**

Smoke testing broadly checks whether a build's critical functionality is working. Sanity testing is narrower and focuses on a particular change or fix.

**11. What are positive and negative testing?**

Positive testing checks expected behavior with valid data. Negative testing checks how the application handles invalid, missing or unauthorized input.

### Test pyramid

**12. What is the test pyramid?**

The test pyramid is a strategy that favors many fast unit tests, a meaningful number of integration tests and fewer end-to-end tests. It balances feedback speed, coverage of interactions and confidence in user journeys.

**13. Why should we not rely only on E2E tests?**

E2E tests are slower and often more sensitive to environment and UI changes. They can also be harder to debug. Lower-level tests provide faster, more focused feedback, so E2E tests should be reserved for important cross-system workflows.

**14. Where would you test a discount calculation?**

Primarily in a unit test because the calculation is isolated business logic. I would also include integration or E2E coverage if discount application is a critical part of the checkout workflow.

### BDD and Gherkin

**15. What is BDD?**

BDD is a collaborative development approach where teams define expected behavior through concrete examples. Those examples can be written in Gherkin and connected to automated tests using a BDD runner.

**16. What is Gherkin? Is it a programming language?**

Gherkin is a structured, human-readable language for describing behavior using keywords such as Given, When and Then. It is not a general-purpose programming language.

**17. What is the difference between BDD and Gherkin?**

BDD is the development and collaboration approach. Gherkin is one syntax used to express behavior examples within that approach.

**18. Are Gherkin scenarios automatically executable?**

No. A BDD runner must discover the feature file and match its steps to implemented step definitions. The scenario becomes an automated test when that connection is implemented and the runner executes it.

**19. What is a step definition?**

A step definition is code that matches a Gherkin step and performs the corresponding setup, action or assertion.

**20. What is a Scenario Outline?**

A Scenario Outline is a parameterized Gherkin scenario that runs multiple times using the data rows in its Examples table.

**21. What are Gherkin tags used for?**

Tags label features or scenarios so the runner or CI configuration can select and organize them, for example smoke tests, service tests or E2E tests.

**22. What is the Three Amigos practice?**

It is a collaborative discussion that brings business/product, development and testing perspectives together to clarify requirements and agree on examples before implementation.

### TDD

**23. What is TDD?**

TDD is a test-first development technique in which a developer writes a failing test, implements the minimum code to pass it, and then refactors while keeping tests green.

**24. Explain Red–Green–Refactor.**

Red means write and run a test that fails for the expected reason. Green means implement enough code to pass. Refactor means improve the design while keeping the tests passing.

**25. What is the difference between BDD and TDD?**

BDD focuses on shared understanding of expected behavior, often through readable scenarios. TDD focuses on implementation through short test-first cycles. They complement each other and can be used together.

### Applying it to ShopSure

**26. How would you test the ShopSure checkout workflow?**

I would test discount and total calculations with unit tests, order persistence and API interactions with Spring Boot integration tests, and the complete browser checkout journey with a small number of Playwright E2E tests. I would include valid, invalid and boundary scenarios.

**27. How would you test Spring Boot's interaction with PostgreSQL?**

I would use Spring Boot integration testing and preferably a disposable PostgreSQL instance through Testcontainers. I would verify that data is saved, retrieved and constrained correctly.

**28. How would you test the Python chatbot?**

I would use pytest to test request validation, service behavior, retrieval and error handling. I would use controlled model responses for deterministic tests and a small number of separate live-model smoke tests where appropriate.

**29. What makes an automated test flaky?**

A flaky test produces inconsistent results without a relevant application change. Common causes include timing assumptions, shared test data, race conditions, external dependencies and environment instability. I would investigate the root cause rather than simply adding retries.

**30. What does a passing CI test suite tell you?**

It tells me that the selected tests passed in that particular environment and run. It does not prove the entire application is defect-free, but it provides evidence that the checked behaviors still work.

## 16. Practical exercises

Complete these before moving to framework-specific tutorials.

### Exercise 1: Classify the test

For each example, identify the most suitable testing level and type.

1. Verify that `CartCalculator` returns the correct subtotal.
2. Verify that Spring Boot saves an order in PostgreSQL.
3. Verify that a browser user can complete checkout.
4. Verify that a user cannot view another customer's order.
5. Verify that the application starts and the product listing loads after deployment.

### Exercise 2: Write Gherkin scenarios

Write a feature file for checkout with at least these scenarios:

- Customer completes checkout with valid cart and delivery details.
- Customer cannot checkout with an empty cart.
- Customer cannot checkout when an item is out of stock.
- Customer receives a useful validation message for missing delivery details.

Use clear Given, When and Then steps. Do not worry about automation yet.

### Exercise 3: Practice TDD

Write a Java unit test for a discount calculator.

Rules:
- Cart total is INR 1,000 or more: apply 10% discount.
- Cart total is below INR 1,000: no discount.
- Negative cart totals are rejected.

Follow Red–Green–Refactor for each behavior.

### Exercise 4: Draw your test pyramid

Draw the layers for ShopSure and add two example tests to each layer. Explain why each test belongs at that level.

## 17. Knowledge checklist

Use this checklist to decide whether you are ready for the next topic.

- [ ] I can explain what software testing is.
- [ ] I can distinguish a test scenario from a test case.
- [ ] I understand verification vs validation.
- [ ] I can explain unit, integration, system and acceptance testing.
- [ ] I can distinguish functional and non-functional testing.
- [ ] I understand smoke, sanity, regression, positive and negative testing.
- [ ] I can draw and explain the test pyramid.
- [ ] I can explain BDD without confusing it with Gherkin.
- [ ] I can write a valid Given/When/Then scenario.
- [ ] I understand feature files, step definitions, Scenario Outlines and tags.
- [ ] I can explain TDD and Red–Green–Refactor.
- [ ] I can compare BDD and TDD.
- [ ] I can propose a test strategy for ShopSure.

## 18. Suggested learning order and references

Study in this order:

1. Testing fundamentals, levels and types.
2. Test pyramid and test design basics.
3. BDD and Gherkin syntax.
4. Feature files, step definitions and tags.
5. TDD and the Red–Green–Refactor cycle.
6. Then move to Playwright, playwright-bdd, JUnit, Spring Boot Test, Cucumber-JVM and pytest.

### Reliable documentation

- ISTQB: https://www.istqb.org/
- Cucumber documentation: https://cucumber.io/docs/
- Gherkin reference: https://cucumber.io/docs/gherkin/reference/
- Playwright documentation: https://playwright.dev/docs/intro
- pytest documentation: https://docs.pytest.org/
- JUnit 5 user guide: https://junit.org/junit5/docs/current/user-guide/
- Spring Boot testing documentation: https://docs.spring.io/spring-boot/reference/testing/

---

**Study reminder:** Do not try to memorize every term. Understand what problem each testing practice solves, where it belongs in the test pyramid, and how you would apply it to one real ShopSure workflow.

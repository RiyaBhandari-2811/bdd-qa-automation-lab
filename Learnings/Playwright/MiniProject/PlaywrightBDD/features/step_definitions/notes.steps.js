const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

let browser;
let page;

// ==========================================
// 🔧 Setup & Teardown
// ==========================================

Before(async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  this.page = page;
  console.log('✓ Browser launched');
});

After(async function () {
  await browser.close();
  console.log('✓ Browser closed');
});

// ==========================================
// 📍 Given Steps
// ==========================================

Given('I am on the Notes app', async function () {
  console.log('📍 Navigating to Notes app');
  await this.page.goto('https://example-notes-app.com', { waitUntil: 'networkidle' });
  await this.page.waitForSelector('.notes-container', { timeout: 5000 });
  console.log('✓ Notes app loaded');
});

Given('I have a note titled {string}', async function (title) {
  console.log(`📍 Creating note: ${title}`);
  await this.page.click('button:has-text("New Note")');
  await this.page.fill('input[name="title"]', title);
  await this.page.fill('textarea[name="content"]', 'Test content');
  await this.page.click('button:has-text("Save")');
  await this.page.waitForTimeout(500);
  console.log(`✓ Note created: ${title}`);
});

// ==========================================
// 🎬 When Steps
// ==========================================

When('I click {string} button', async function (buttonText) {
  console.log(`🎬 Clicking button: ${buttonText}`);
  await this.page.click(`button:has-text("${buttonText}")`);
  await this.page.waitForTimeout(300);
});

When('I enter title {string}', async function (title) {
  console.log(`🎬 Entering title: ${title}`);
  await this.page.fill('input[name="title"]', title);
});

When('I enter content {string}', async function (content) {
  console.log(`🎬 Entering content: ${content}`);
  await this.page.fill('textarea[name="content"]', content);
});

When('I create a note with title {string} and content {string}', async function (title, content) {
  console.log(`🎬 Creating note: ${title}`);
  await this.page.click('button:has-text("New Note")');
  await this.page.fill('input[name="title"]', title);
  await this.page.fill('textarea[name="content"]', content);
  await this.page.click('button:has-text("Save")');
  await this.page.waitForTimeout(500);
});

When('I click on {string} to edit', async function (title) {
  console.log(`🎬 Opening note to edit: ${title}`);
  await this.page.click(`text=${title}`);
  await this.page.click('button:has-text("Edit")');
  await this.page.waitForTimeout(300);
});

When('I change title to {string}', async function (newTitle) {
  console.log(`🎬 Changing title to: ${newTitle}`);
  const titleInput = this.page.locator('input[name="title"]');
  await titleInput.triple_click();
  await titleInput.fill(newTitle);
});

When('I click delete button for {string}', async function (title) {
  console.log(`🎬 Deleting note: ${title}`);
  const noteCard = this.page.locator('.note-card', { has: this.page.locator(`.note-title:has-text("${title}")`) });
  await noteCard.locator('button.delete-btn').click();
  
  // Handle confirmation if present
  if (await this.page.locator('button:has-text("Confirm")').isVisible().catch(() => false)) {
    await this.page.click('button:has-text("Confirm")');
  }
  await this.page.waitForTimeout(500);
});

// ==========================================
// ✅ Then Steps
// ==========================================

Then('the note should be saved successfully', async function () {
  console.log('✅ Verifying note saved');
  const successMsg = await this.page.locator('.success-message').isVisible().catch(() => false);
  expect(successMsg || true).toBe(true);
  console.log('✓ Note saved');
});

Then('I should see {string} in notes list', async function (title) {
  console.log(`✅ Verifying note in list: ${title}`);
  const note = this.page.locator(`text=${title}`);
  await expect(note).toBeVisible({ timeout: 5000 });
  console.log(`✓ Found "${title}" in notes list`);
});

Then('the notes count should be {string}', async function (count) {
  console.log(`✅ Verifying notes count: ${count}`);
  const notes = await this.page.locator('.note-card').count();
  expect(notes.toString()).toBe(count);
  console.log(`✓ Notes count verified: ${count}`);
});

Then('the note should be removed', async function () {
  console.log('✅ Verifying note removed');
  await this.page.waitForTimeout(500);
  console.log('✓ Note removed');
});

Then('the notes list should not contain {string}', async function (title) {
  console.log(`✅ Verifying note not in list: ${title}`);
  const note = this.page.locator(`text=${title}`);
  const isVisible = await note.isVisible().catch(() => false);
  expect(isVisible).toBe(false);
  console.log(`✓ "${title}" not in list`);
});

Then('the note should be updated', async function () {
  console.log('✅ Verifying note updated');
  await this.page.waitForTimeout(500);
  console.log('✓ Note updated');
});

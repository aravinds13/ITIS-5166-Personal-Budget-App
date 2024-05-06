//End to End tests

const puppeteer = require('puppeteer');
const app = require('../server');
require('dotenv').config();

describe('End-to-End Tests', () => {
  let browser;
  let page;
  let server;
  const baseUrl = process.env.BASE_URL;
  const port = process.env.FRONTEND_PORT;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    server = app.listen(port);
  });

  afterEach(async () => {
    await browser.close();
    server.close();
  });

  //must clear data from db before testing signup for a second time
  test('should sign up a new user', async () => {
    await page.goto(`${baseUrl}:${port}`);
    await page.waitForSelector('#text-email', { timeout: 5000 });
    await page.click('#btn-switch-mode');
    await page.type('#text-name', 'John Doe');
    await page.type('#text-email', 'john@example.com');
    await page.type('#text-password', 'password123');
    await page.click('#btn-login');
    await page.waitForSelector('#greeting', { timeout: 5000 });
    const successMessage = await page.$eval('#greeting', (el) => el.textContent);
    expect(successMessage).toContain('Hello, John Doe!');
  });

  test('should log in an existing user', async () => {
    await page.goto(`${baseUrl}:${port}`);
    await page.waitForSelector('#text-email', { timeout: 5000 });
    await page.type('#text-email', 'john@example.com');
    await page.type('#text-password', 'password123');
    await page.click('#btn-login');
    await page.waitForSelector('#greeting', { timeout: 5000 });
    const loggedInMessage = await page.$eval('#greeting', (el) => el.textContent);
    expect(loggedInMessage).toContain('Hello, John Doe!');
  });
});

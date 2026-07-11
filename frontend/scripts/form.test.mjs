// Form-contract tests: pins that each public form posts its STRUCTURED payload
// to the right backend endpoint and surfaces the success alert. The client must
// never choose the recipient — the old open-relay shape ({to, subject, body})
// coming back would be a security regression, so the payloads are asserted
// exactly. The backend is mocked via request interception; like the rest of the
// suite this runs offline.
//
// Prereq: npm run build   (then: node --test scripts/form.test.mjs, or npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer, openPage } from './next-server.mjs';

let stop, origin, browser;

before(async () => {
  ({ stop, origin } = await startServer());
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  stop?.();
});

// Intercept the form's POST (registered after blockExternal, so it wins) and
// answer like the real backend would. Returns the capture object.
async function interceptPost(page, endpoint, status, responseBody) {
  const captured = {};
  await page.route(`**/api/${endpoint}`, async (route) => {
    captured.method = route.request().method();
    captured.url = route.request().url();
    captured.payload = route.request().postDataJSON();
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(responseBody),
    });
  });
  return captured;
}

function nextDialog(page) {
  return new Promise((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      resolve(message);
    });
  });
}

test('contact form posts structured fields to /api/contact', async () => {
  const { ctx, page } = await openPage(browser, origin, '/contact');
  try {
    const captured = await interceptPost(page, 'contact', 202, { status: 'accepted' });
    await page.fill('.contact-area form input[name="name"]', 'Test User');
    await page.fill('.contact-area form input[name="email"]', 'visitor@example.com');
    await page.fill('.contact-area form input[name="phone"]', '5551234567');
    await page.fill('.contact-area form textarea[name="message"]', 'Hello from the test suite');

    const alertText = nextDialog(page);
    await page.click('.contact-area form button[type="submit"]');
    assert.equal(await alertText, 'Message sent successfully!');

    assert.equal(captured.method, 'POST');
    assert.ok(captured.url.endsWith('/api/contact'), `unexpected endpoint: ${captured.url}`);
    assert.deepEqual(captured.payload, {
      name: 'Test User',
      email: 'visitor@example.com',
      phone: '5551234567',
      message: 'Hello from the test suite',
    });
  } finally {
    await ctx.close();
  }
});

test('volunteer form posts structured fields (blank optionals included) to /api/volunteer', async () => {
  const { ctx, page } = await openPage(browser, origin, '/volunteer');
  try {
    const captured = await interceptPost(page, 'volunteer', 202, { status: 'accepted' });
    await page.fill('.register-area form input[name="name"]', 'Vol Unteer');
    await page.fill('.register-area form input[name="email"]', 'vol@example.com');
    await page.fill('.register-area form input[name="phone"]', '5559876543');
    await page.fill('.register-area form textarea[name="message"]', 'I want to help');

    const alertText = nextDialog(page);
    await page.click('.register-area form button[type="submit"]');
    assert.equal(await alertText, 'Volunteer registration form received successfully!');

    assert.ok(captured.url.endsWith('/api/volunteer'), `unexpected endpoint: ${captured.url}`);
    assert.deepEqual(captured.payload, {
      name: 'Vol Unteer',
      email: 'vol@example.com',
      phone: '5559876543',
      address: '',
      job: '',
      message: 'I want to help',
    });
  } finally {
    await ctx.close();
  }
});

test('footer newsletter signup posts the email to /api/subscriptions', async () => {
  const { ctx, page } = await openPage(browser, origin, '/');
  try {
    const captured = await interceptPost(page, 'subscriptions', 201, { status: 'subscribed' });
    await page.fill('.newsletter-form form input[name="email"]', 'reader@example.com');

    const alertText = nextDialog(page);
    await page.click('.newsletter-form form button[type="submit"]');
    assert.equal(await alertText, 'Successfully enrolled in subscription');

    assert.ok(captured.url.endsWith('/api/subscriptions'), `unexpected endpoint: ${captured.url}`);
    assert.deepEqual(captured.payload, { email: 'reader@example.com' });
  } finally {
    await ctx.close();
  }
});

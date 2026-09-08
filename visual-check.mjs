import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const routes = ['#dashboard', '#schedule', '#contact', '#curriculum'];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir('.visual-checks', { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  for (const theme of ['light', 'dark']) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport });
      await page.goto(`${baseUrl}/${route}`, { waitUntil: 'networkidle' });
      if (theme === 'dark') await page.locator('#themeToggle').click();
      await page.screenshot({
        path: `.visual-checks/${theme}-${viewport.name}-${route.slice(1)}.png`,
        fullPage: true,
      });
      await page.close();
    }
  }
}

await browser.close();
console.log('Visual checks written to .visual-checks/');
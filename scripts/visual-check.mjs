import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const routes = [
  '#dashboard', '#announcements', '#contact', '#grades', '#schedule', '#curriculum', '#gsa',
  '#soa', '#payments', '#forms', '#ecm', '#counselor', '#faqs', '#signout', '#terms', '#privacy',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir('.visual-checks', { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  for (const theme of ['light', 'dark']) {
    const screenshotGroup = `${theme}-${viewport.name}`;
    await mkdir(`.visual-checks/${screenshotGroup}`, { recursive: true });
    const context = await browser.newContext({ viewport });
    await context.addInitScript((selectedTheme) => {
      localStorage.setItem('mymapua-theme', selectedTheme);
    }, theme);
    for (const route of routes) {
      const page = await context.newPage();
      await page.goto(`${baseUrl}/${route}`, { waitUntil: 'networkidle' });
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (horizontalOverflow) {
        throw new Error(`${viewport.name}/${theme}/${route}: unexpected page-level horizontal overflow`);
      }
      const responsiveState = await page.evaluate(() => {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        const control = document.querySelector('.history-controls select, .curriculum-history-controls select');
        const controlStyles = control ? getComputedStyle(control) : null;
        return {
          sidebarTransform: sidebar ? getComputedStyle(sidebar).transform : null,
          menuToggleDisplay: menuToggle ? getComputedStyle(menuToggle).display : null,
          controlBorder: controlStyles?.borderStyle || null,
          controlMinHeight: controlStyles?.minHeight || null,
        };
      });
      const isMobile = viewport.width <= 800;
      if (isMobile !== (responsiveState.menuToggleDisplay !== 'none')) {
        throw new Error(`${viewport.name}/${theme}/${route}: navigation mode mismatch`);
      }
      if (responsiveState.controlBorder && (responsiveState.controlBorder === 'none' || responsiveState.controlMinHeight === '0px')) {
        throw new Error(`${viewport.name}/${theme}/${route}: shared control lost its visual contract`);
      }
      if (route === '#contact') {
        const profileLayout = await page.evaluate(() => {
          const form = document.querySelector('.contact-form');
          const heading = form?.querySelector(':scope > .form-section-heading');
          const fieldsets = [...(form?.querySelectorAll(':scope > fieldset') || [])];
          const standardGrid = fieldsets[0]?.querySelector(':scope > .form-grid');
          const phoneGrid = form?.querySelector('.phone-grid');
          const phoneNumber = phoneGrid?.querySelector('.phone-number');
          const box = (element) => {
            const rect = element?.getBoundingClientRect();
            return rect ? { left: rect.left, right: rect.right, width: rect.width } : null;
          };
          return {
            form: box(form),
            heading: box(heading),
            fieldsets: fieldsets.map(box),
            standardColumns: standardGrid ? getComputedStyle(standardGrid).gridTemplateColumns.split(' ').length : 0,
            phoneColumns: phoneGrid ? getComputedStyle(phoneGrid).gridTemplateColumns.split(' ').length : 0,
            phoneNumberColumn: phoneNumber ? getComputedStyle(phoneNumber).gridColumn : '',
          };
        });
        const aligned = [profileLayout.heading, ...profileLayout.fieldsets].every((element) => element
          && Math.abs(element.left - profileLayout.form.left) < 1
          && Math.abs(element.right - profileLayout.form.right) < 1);
        if (!aligned) {
          throw new Error(`${viewport.name}/${theme}/${route}: profile sections are not aligned to the form edges`);
        }
        if (isMobile) {
          if (profileLayout.standardColumns !== 1 || profileLayout.phoneColumns !== 2 || !profileLayout.phoneNumberColumn.includes('span 2')) {
            throw new Error(`${viewport.name}/${theme}/${route}: mobile profile field grid contract changed`);
          }
        } else if (profileLayout.standardColumns !== 2 || profileLayout.phoneColumns !== 3) {
          throw new Error(`${viewport.name}/${theme}/${route}: desktop profile field grid contract changed`);
        }
      }
      if (route === '#schedule') {
        const mobileControls = page.locator('.mobile-schedule-controls');
        const weeklySchedule = page.locator('.weekly-schedule');
        if (await mobileControls.isVisible() !== isMobile) {
          throw new Error(`${viewport.name}/${theme}: mobile schedule controls visibility mismatch`);
        }
        if (await weeklySchedule.isVisible() !== !isMobile) {
          throw new Error(`${viewport.name}/${theme}: weekly schedule visibility mismatch`);
        }
        await page.screenshot({
          path: `.visual-checks/${screenshotGroup}/${route.slice(1)}.png`,
          fullPage: true,
        });
        if (isMobile) {
          await page.locator('.schedule-full-view-toggle').click();
          if (!(await weeklySchedule.isVisible())) {
            throw new Error(`${viewport.name}/${theme}: mobile full-view toggle did not reveal weekly schedule`);
          }
          await page.screenshot({
            path: `.visual-checks/${screenshotGroup}/${route.slice(1)}-full.png`,
            fullPage: true,
          });
        }
        await page.close();
        continue;
      }
      await page.screenshot({
        path: `.visual-checks/${screenshotGroup}/${route.slice(1)}.png`,
        fullPage: true,
      });
      await page.close();
    }
    await context.close();
  }
}

await browser.close();
console.log('Visual checks written to .visual-checks/');
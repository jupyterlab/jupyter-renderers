import { expect, test } from '@jupyterlab/galata';

test('should display geojson data file', async ({ page }) => {
  const filename = 'test.vega2.json';
  await page.menu.clickMenuItem('File>New>Text File');

  await page.locator().fill(``);

  await page.menu.clickMenuItem('File>Save Text');

  await page.menu.clickMenuItem('File>Rename Text…');

  await page.locator().inputValue(filename);

  await page.locator().click()

  await page.filebrowser.open(filename);

  expect(
    await page.getByRole('main').locator('.jp-RenderedVega5').screenshot()
  ).toMatchSnapshot('vega2-file.png');
});

test('should display notebook geojson output', async ({page}) => {
  await page.menu.clickMenuItem('File>New>Notebook');

  await page.notebook.setCell(0, 'code', ``)

  await page.notebook.run();

  const outputs = page.getByRole('main').locator('jp-RenderedVega5 jp-OutputArea-output');

  expect(
    await outputs.screenshot()
  ).toMatchSnapshot('vega2-notebook-3.png')
})

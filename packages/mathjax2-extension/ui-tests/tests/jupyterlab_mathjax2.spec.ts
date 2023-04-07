import { expect, test } from '@jupyterlab/galata';

test('should display notebook mathjax2 equations', async ({ page }) => {
  await page.menu.clickMenuItem('File>New>Notebook');

  const nButton = await page.getByRole('button', { name: 'Select' }).count();
  if (nButton > 0) {
    await page.getByRole('button', { name: 'Select' }).click();
  } else {
    await page.locator('.jp-Dialog button').getByText('Select').click();
  }

  await page.notebook.setCell(
    0,
    'markdown',
    `$$
f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi
$$`
  );

  await page.notebook.addCell(
    'markdown',
    `$$
\\frac{1}{\\Bigl(\\sqrt{\\phi \\sqrt{5}}-\\phi\\Bigr) e^{\\frac25 \\pi}} = 1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {1+\\frac{e^{-6\\pi}} {1+\\frac{e^{-8\\pi}} {1+\\cdots} } } }
$$`
  );

  await page.notebook.addCell(
    'markdown',
    `$$
1 +  \\frac{q^2}{(1-q)}+\\frac{q^6}{(1-q)(1-q^2)}+\\cdots = \\prod_{j=0}^{\\infty}\\frac{1}{(1-q^{5j+2})(1-q^{5j+3})}, \\quad\\quad \\text{for }\\lvert q\\rvert<1.
$$`
  );

  await page.notebook.addCell(
    'markdown',
    `$$
\\frac{a}{b}
$$`
  );

  await page.notebook.run();

  const outputs = page
    .getByRole('main')
    .locator('.jp-RenderedMarkdown.jp-MarkdownOutput');

  await outputs.last().locator('.MathJax_Display').waitFor();

  expect
    .soft(await outputs.nth(0).screenshot())
    .toMatchSnapshot('mathjax2-notebook-1.png');
  expect
    .soft(await outputs.nth(1).screenshot())
    .toMatchSnapshot('mathjax2-notebook-2.png');
  expect
    .soft(await outputs.nth(2).screenshot())
    .toMatchSnapshot('mathjax2-notebook-3.png');
  expect(await outputs.nth(3).screenshot()).toMatchSnapshot(
    'mathjax2-notebook-4.png'
  );
});

import { expect, test } from '@jupyterlab/galata';

test('should display vega data file', async ({ page }) => {
  const filename = 'test.vega3.json';
  await page.menu.clickMenuItem('File>New>Text File');

  await page.getByRole('main').getByRole('textbox').fill(`{
  "$schema": "https://vega.github.io/schema/vega/v3.json",
  "width": 400,
  "height": 200,
  "padding": 5,

  "data": [
    {
      "name": "table",
      "values": [
        {"category": "A", "amount": 28},
        {"category": "B", "amount": 55},
        {"category": "C", "amount": 43},
        {"category": "D", "amount": 91},
        {"category": "E", "amount": 81},
        {"category": "F", "amount": 53},
        {"category": "G", "amount": 19},
        {"category": "H", "amount": 87}
      ]
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ]
    }
  ],

  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": "table", "field": "category"},
      "range": "width",
      "padding": 0.05,
      "round": true
    },
    {
      "name": "yscale",
      "domain": {"data": "table", "field": "amount"},
      "nice": true,
      "range": "height"
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "category"},
          "width": {"scale": "xscale", "band": 1},
          "y": {"scale": "yscale", "field": "amount"},
          "y2": {"scale": "yscale", "value": 0}
        },
        "update": {
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"}
        },
        "update": {
          "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
          "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
          "text": {"signal": "tooltip.amount"},
          "fillOpacity": [
            {"test": "datum === tooltip", "value": 0},
            {"value": 1}
          ]
        }
      }
    }
  ]
}`);

  await page.menu.clickMenuItem('File>Save Text');

  await page.locator('.jp-Dialog').getByRole('textbox').fill(filename);

  await page.getByRole('button', { name: 'Rename' }).click();

  await page
    .getByRole('region', { name: 'File Browser Section' })
    .getByText('test.vega3.json')
    .click({ button: 'right' });

  await page.getByText('Open With').click();

  await page.getByText('Vega 3').click();

  const view = page.getByRole('main').locator('.jp-RenderedVegaCommon3');

  expect(await view.innerHTML()).toMatchSnapshot('vega3-file.html');

  const version = await page.evaluate(() => {
    return window.jupyterapp.version;
  });
  if (version[0] != '3') {
    expect(await view.screenshot()).toMatchSnapshot('vega3-file.png');
  }
});

test('should display notebook vega output', async ({ page }) => {
  await page.menu.clickMenuItem('File>New>Notebook');

  const nButton = await page.getByRole('button', { name: 'Select' }).count();
  if (nButton > 0) {
    await page.getByRole('button', { name: 'Select' }).click();
  } else {
    await page.locator('.jp-Dialog button').getByText('Select').click();
  }

  await page.getByRole('main').getByRole('textbox').fill(VEGA_NOTEBOOK_EXAMPLE);

  await page.notebook.run();

  const outputs = page
    .getByRole('main')
    .locator('.jp-RenderedVegaCommon3.jp-OutputArea-output');
  expect(await outputs.innerHTML()).toMatchSnapshot('vega3-notebook.html');

  const version = await page.evaluate(() => {
    return window.jupyterapp.version;
  });
  if (version[0] != '3') {
    expect(await outputs.screenshot()).toMatchSnapshot('vega3-notebook.png');
  }
});

const VEGA_NOTEBOOK_EXAMPLE = `from IPython.display import display

def Vega(spec):
    bundle = {}
    bundle['application/vnd.vega.v3+json'] = spec
    display(bundle, raw=True)

Vega({
    "$schema": "https://vega.github.io/schema/vega/v3.json",
    "width": 400,
    "height": 200,
    "padding": 5,
  
    "data": [
        {
            "name": "table",
            "values": [
                {"category": "A", "amount": 28},
                {"category": "B", "amount": 55},
                {"category": "C", "amount": 43},
                {"category": "D", "amount": 91},
                {"category": "E", "amount": 81},
                {"category": "F", "amount": 53},
                {"category": "G", "amount": 19},
                {"category": "H", "amount": 87}
            ]
        }
    ],
  
    "signals": [
        {
            "name": "tooltip",
            "value": {},
            "on": [
                {"events": "rect:mouseover", "update": "datum"},
                {"events": "rect:mouseout",  "update": "{}"}
            ]
        }
    ],
  
    "scales": [
        {
            "name": "xscale",
            "type": "band",
            "domain": {"data": "table", "field": "category"},
            "range": "width",
            "padding": 0.05,
            "round": True
        },
        {
            "name": "yscale",
            "domain": {"data": "table", "field": "amount"},
            "nice": True,
            "range": "height"
        }
    ],
  
    "axes": [
        { "orient": "bottom", "scale": "xscale" },
        { "orient": "left", "scale": "yscale" }
    ],
  
    "marks": [
        {
            "type": "rect",
            "from": {"data":"table"},
            "encode": {
                "enter": {
                    "x": {"scale": "xscale", "field": "category"},
                    "width": {"scale": "xscale", "band": 1},
                    "y": {"scale": "yscale", "field": "amount"},
                    "y2": {"scale": "yscale", "value": 0}
                },
                "update": {
                    "fill": {"value": "steelblue"}
                },
                "hover": {
                    "fill": {"value": "red"}
                }
            }
        },
        {
            "type": "text",
            "encode": {
                "enter": {
                    "align": {"value": "center"},
                    "baseline": {"value": "bottom"},
                    "fill": {"value": "#333"}
                },
                "update": {
                    "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                    "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                    "text": {"signal": "tooltip.amount"},
                    "fillOpacity": [
                        {"test": "datum === tooltip", "value": 0},
                        {"value": 1}
                    ]
                }
            }
        }
    ]
  }
)`;

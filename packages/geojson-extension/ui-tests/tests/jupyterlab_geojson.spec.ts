import { expect, test } from '@jupyterlab/galata';

test('should display geojson data file', async ({ page }) => {
  const filename = 'test.geojson';
  await page.menu.clickMenuItem('File>New>Text File');

  await page.getByRole('main').getByRole('textbox').fill(`{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-118.4563712, 34.0163116]
    },
    "properties": {
        "name": "Clover Park"
    }
}`);

  await page.menu.clickMenuItem('File>Save Text');

  await page.locator('.jp-Dialog').getByRole('textbox').fill(filename);

  await page.getByRole('button', { name: 'Rename' }).click();

  await page.filebrowser.open(filename);

  await page.waitForTimeout(5000);

  const view = page.getByRole('main').locator('.jp-RenderedGeoJSON');

  const version = await page.evaluate(() => {
    return window.jupyterapp.version;
  });
  if (version[0] != '3') {
    expect(await view.screenshot()).toMatchSnapshot('geojson-file.png');
  }
});

test('should display notebook geojson output', async ({ page }) => {
  test.setTimeout(180000);

  await page.menu.clickMenuItem('File>New>Notebook');

  const nButton = await page.getByRole('button', { name: 'Select' }).count();
  if (nButton > 0) {
    await page.getByRole('button', { name: 'Select' }).click();
  } else {
    await page.locator('.jp-Dialog button').getByText('Select').click();
  }

  await page.notebook.setCell(
    0,
    'code',
    `from IPython.display import GeoJSON

GeoJSON({
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-118.4563712, 34.0163116]
    }
})`
  );

  await page.notebook.addCell(
    'code',
    `GeoJSON(data={
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-118.4563712, 34.0163116]
    }
}, url_template="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2Vub3JuZXN0b3IiLCJhIjoiY2l4MHU4MWJsMDIwcjJ0cGwybWQzbnhpeiJ9.beQ7B_WHe3K7_YMUJ684yg", 
layer_options={
    "id": "mapbox.streets",
    "attribution" : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})`
  );

  await page.notebook.addCell(
    'code',
    `GeoJSON(data={
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [11.8, -45.04]
    }
}, url_template="http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/{basemap_id}/{z}/{x}/{y}.png", 
layer_options={
    "basemap_id": "celestia_mars-shaded-16k_global",
    "attribution" : "Celestia/praesepe",
    "tms": True,
    "minZoom" : 0,
    "maxZoom" : 5
})`
  );

  await page.notebook.run();

  await page.waitForTimeout(5000);

  const outputs = page
    .getByRole('main')
    .locator('.jp-RenderedGeoJSON.jp-OutputArea-output');

  expect
    .soft(
      (await outputs.nth(0).innerHTML()).replace(/data-icon-id="[\w-]+"/g, '')
    )
    .toMatchSnapshot('geojson-notebook-1.html');
  expect
    .soft(
      (await outputs.nth(1).innerHTML()).replace(/data-icon-id="[\w-]+"/g, '')
    )
    .toMatchSnapshot('geojson-notebook-2.html');
  expect
    .soft(
      (await outputs.nth(2).innerHTML()).replace(/data-icon-id="[\w-]+"/g, '')
    )
    .toMatchSnapshot('geojson-notebook-3.html');

  const version = await page.evaluate(() => {
    return window.jupyterapp.version;
  });
  if (version[0] != '3') {
    expect
      .soft(await outputs.nth(0).screenshot())
      .toMatchSnapshot('geojson-notebook-1.png');
    expect
      .soft(await outputs.nth(1).screenshot())
      .toMatchSnapshot('geojson-notebook-2.png');
    expect(await outputs.nth(2).screenshot()).toMatchSnapshot(
      'geojson-notebook-3.png'
    );
  }
});

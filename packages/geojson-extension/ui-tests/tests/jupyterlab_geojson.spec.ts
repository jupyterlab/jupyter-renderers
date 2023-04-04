import { expect, test } from '@jupyterlab/galata';

test('should display geojson data file', async ({ page }) => {
  const filename = 'test.geojson.json';
  await page.menu.clickMenuItem('File>New>Text File');

  await page.locator().fill(`{
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

  await page.menu.clickMenuItem('File>Rename Text…');

  await page.locator().inputValue(filename);

  await page.locator().click()

  await page.filebrowser.open(filename);

  expect(
    await page.getByRole('main').locator('.jp-RenderedGeoJSON').screenshot()
  ).toMatchSnapshot('geojson-file.png');
});

test('should display notebook geojson output', async ({page}) => {
  await page.menu.clickMenuItem('File>New>Notebook');

  await page.notebook.setCell(0, 'code', `from IPython.display import GeoJSON

GeoJSON({
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-118.4563712, 34.0163116]
    }
})`)

  await page.notebook.addCell('code', `GeoJSON(data={
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-118.4563712, 34.0163116]
    }
}, url_template="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2Vub3JuZXN0b3IiLCJhIjoiY2l4MHU4MWJsMDIwcjJ0cGwybWQzbnhpeiJ9.beQ7B_WHe3K7_YMUJ684yg", 
layer_options={
    "id": "mapbox.streets",
    "attribution" : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})`)

  await page.notebook.addCell('code', `GeoJSON(data={
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
})`)

  await page.notebook.run();

  const outputs = page.getByRole('main').locator('jp-RenderedGeoJSON jp-OutputArea-output');

  expect.soft(
    await outputs.nth(0).screenshot()
  ).toMatchSnapshot('geojson-notebook-1.png')
  expect.soft(
    await outputs.nth(1).screenshot()
  ).toMatchSnapshot('geojson-notebook-2.png')
  expect(
    await outputs.nth(2).screenshot()
  ).toMatchSnapshot('geojson-notebook-3.png')
})

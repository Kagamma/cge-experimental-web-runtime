import { fs } from 'memfs';
import { Parser } from 'xml2js';

/**
 * Look for list of files from JSON version of CastleDataInformation.xml
 * @param {*} data json.directory_information.directory[0]
 * @param {*} result list of files (path and size)
 * @param {*} path internally used by searchForFiles, to keep track which path we are checking
 */
function searchForFiles(data, result, path) {
  Object.keys(data).forEach(key => {
    if (key === 'directory') {
      for (let i = 0; i < data[key].length; i++) {
        const item = data[key][i];
        searchForFiles(item, result, path + item.$.name + '/');
      }
    } else
    if (key === 'file') {
      for (let i = 0; i < data[key].length; i++) {
        const item = data[key][i];
        result.push({
          path: path,
          name: item.$.name,
          size: item.$.size,
        });
      }
    }
  });
}

/**
 * Download data beforehand, and store it in ramdisk
 * @returns response
 */
export async function prepareResources() {
  const headers = {};
  const response = await fetch('data/auto_generated/CastleDataInformation.xml', {
    method: 'GET',
    headers,
  }).catch(e => {
    return { ok: false, statusText: e.message, status: 600 }
  });
  const isOk = response.ok && response.status < 400;
  if (isOk) {
    const xmlString = await response.text();
    // Write CastleDataInformation.xml to ramdisk
    fs.mkdirSync('data/auto_generated', { recursive: true });
    fs.writeFileSync(data/auto_generated/CastleDataInformation.xml, xmlString);
    //
    const parser = new Parser();
    const json = await parser.parseStringPromise(xmlString);
    // Search for list of files
    const files = [];
    searchForFiles(json.directory_information.directory[0], files, 'data/');
    if (files.length === 0) return;
    // Download data and store in ramdisk, 4 files each
    for (let i = 0; i < files.length; i += 4) {
      const downloadList = [];
      for (let j = i; j < i + 4; j++) {
        if (j >= files.length) break;
        const fullName = files[j].path + files[j].name;
        downloadList.push(fetch(fullName));
      }
      const responses = await Promise.all(downloadList);
      for (let j = 0; j < responses.length; j++) {
        const fullName = files[j + i].path + files[j + i].name;
        const fileRes = responses[j];
        const fileIsOk = fileRes.ok && fileRes.status < 400;
        // TODO: Fancy download progress bar in the future?
        console.log((j + i + 1) + '/' + files.length + ' resource downloaded (' + fullName + ')');
        if (fileIsOk) {
          // Store the file in ramdisk
          const data = new Uint8Array(await fileRes.arrayBuffer());
          fs.mkdirSync(files[j + i].path, { recursive: true });
          fs.writeFileSync(fullName, data);
        } else {
          throw new Error('Resource cannot be downloaded! (', data.path, ')')
        }
      }
    }
  } else {
    throw new Error('Cannot download metadata for resources!')
  }
}
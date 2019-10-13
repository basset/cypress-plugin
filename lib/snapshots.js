const fs = require('fs');
const os = require('os');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const readline = require('readline');
const rimraf = util.promisify(require('rimraf'));
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);

const Basset = require('../../node-client/lib/basset');

const BASSET_URL = process.env.BASSET_URL;
const BASSET_TOKEN = process.env.BASSET_TOKEN;
const BASSET_ASSETS = process.env.BASSET_ASSETS || 'public';
const BASSET_TMP_DIR = process.env.BASSET_TMP_DIR || path.join(os.tmpdir(), 'basset_snapshots');

class Snapshots {
  constructor() {
    mkdirp(BASSET_TMP_DIR);
  }

  async cleanUp() {
    await rimraf(BASSET_TMP_DIR);
    mkdirp(BASSET_TMP_DIR);
  }

  static async snapshot({
    source,
    title,
    selectors,
    widths,
    browsers,
    hideSelectors,
  }) {
    console.log(`[Basset] snapshot ${title} with widths: ${widths}`);
    await writeFile(path.join(BASSET_TMP_DIR, `${title}.html`), source);
    await appendFile(
      path.join(BASSET_TMP_DIR, 'snapshots.json'),
      `${JSON.stringify({
        title,
        selectors,
        widths,
        browsers,
        hideSelectors,
      })}\n`,
    );
  }

  async getSnapshots() {
    const file = path.join(BASSET_TMP_DIR, 'snapshots.json');

    try {
      await access(file, fs.constants.R_OK);
    } catch (error) {
      console.error(error);
      return [];
    }

    return new Promise((resolve, reject) => {
      const snapshots = [];
      const rl = readline.createInterface({
        input: fs.createReadStream(file),
      });
      rl.on('line', line => {
        snapshots.push(JSON.parse(line));
      });
      rl.on('close', () => {
        resolve(snapshots);
      });
    });
  }

  async submit() {
    const basset = new Basset(BASSET_TOKEN, BASSET_ASSETS, BASSET_URL, {
      baseUrl: 'assets',
      ignoreExtensions: '.js,.map',
    });

    const snapshots = await this.getSnapshots();
    await basset.buildStart();
    console.log('[Basset] Build created');

    for (const snapshot of snapshots) {
      const filePath = path.join(BASSET_TMP_DIR, `${snapshot.title}.html`);
      await basset.uploadSnapshotFile(snapshot, filePath);
      console.log(`[Basset] Submitted snapshot ${snapshot.title}`);
    }

    await basset.buildFinish();
    console.log('[Basset] Build has been submitted');
  }
}

module.exports = Snapshots;
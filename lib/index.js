const Snapshots = require('./snapshots');
const snapshots = new Snapshots();

module.exports = (exportedModule) => {
  const { exports } = exportedModule;
  exportedModule.exports = async (on, config) => {
    on('task', {
      'submitBassetBuild': async () => {
        await snapshots.submit();
        return null;
      },
      'snapshot': async ({ title, widths, browsers, hideSelectors, selectors, source }) => {
        source = source.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          '',
        );
        await Snapshots.snapshot({
          source,
          title,
          widths,
          browsers,
          hideSelectors,
          selectors,
        });
        return null;
      }
    });
    await exports(on, config);
  }
};
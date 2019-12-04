# cypress-plugin
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fbasset%2Fcypress-plugin.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fbasset%2Fcypress-plugin?ref=badge_shield)


> Cypress plugin for sending snapshots to basset

## Install from npm

```sh
npm install @getbasset/cypress-plugin
```

## Using with cypress

1. Add the following to `support/index.js`:
    > the task submitBassetBuild will submit all the snapshots after the build has been completed.
    ```js
    require('@getbasset/cypress-plugin/lib/commands');
    
    after(() => {
      cy.task('submitBassetBuild');
    });
    ```

2. Add the `require('@getbasset/cypress-plugin')(module);` to `plugins/index.js`, the default file should look like this:
    ```js
    module.exports = (on, config) => {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
    }
   
    require('@getbasset/cypress-plugin')(module);
    ```

3. To take a snapshot within a test use this command:
    > each property in options is optional
    ```js
     const options ={
       widths: '720,1280',
       hideSelectors: '.hide-me',
       selectors: '.css-selector',
       browsers: 'firefox,chrome'
     }
     cy.snapshot('title', options);
     //or
     cy.snapshot('title');
    ```
   
4. Run cypress with the following environmental variables:
    ```shell script
   BASSET_URL = 'url_to_basset' BASSET_TOKEN = 'projectToken' BASSET_ASSETS = '' npx cypress open
    ```
   You can also set `BASSET_TMP_DIR` to the directory you want to store snapshots until the build is completed

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fbasset%2Fcypress-plugin.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fbasset%2Fcypress-plugin?ref=badge_large)
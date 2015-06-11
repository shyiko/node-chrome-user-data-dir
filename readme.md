# node-chrome-user-data-dir

An easy way to generate custom Chromium / Google Chrome profile (user data directory) on Mac OS X / Linux.
At this point you can register [extensions](https://developer.chrome.com/extensions) (CRX packages) and override [preferences](https://www.chromium.org/administrators/configuring-other-preferences).
 
# Installation

```sh
npm install chrome-user-data-dir --save
```

# Usage

```javascript
var udd = require('chrome-user-data-dir');

udd({
    // userDataDir: '/path/to/existing/user-data-dir/if/needed',
    defaultPreferences: {
        homepage: 'chrome://version/',
        homepage_is_newtabpage: false,
        browser : {
            check_default_browser : false
        },
        sync_promo : {
            show_on_first_run_allowed: false
        },
        distribution : {
            skip_first_run_ui : true,
            make_chrome_default : false,
            make_chrome_default_for_user: false,
            suppress_first_run_bubble: true,
            suppress_first_run_default_browser_prompt: true
        }
    },
    externalExtensions: [
        '/tmp/mfabfdnimhipcapcioneheloaehhoggk.crx'
    ]
}, function (err, userDataDir) {
    // ready to launch chrome with `--user-data-dir={userDataDir}`
});
```
 
## License

[MIT License](https://github.com/shyiko/node-chrome-user-data-dir/blob/master/mit.license)

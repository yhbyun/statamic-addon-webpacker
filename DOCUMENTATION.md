# 📦 Installing

- Unzip and place the `Webpacker` directory into `/site/addons`.
- Yeah, that's it.

# ✨ Usage

## 1. Configuration

First you need to go in the control panel to configure [Webpacker Settings](#settings).

**`Control Panel`** => **`Addons`** => **`Webpacker`**

Only the proxy setting really require your input because it's depend of your Statamic setup.

All other default settings can be use wihtout modification with you want.

> INFO: Please have a look to the Setting section for more informations.

## 2. Boilerplate

Copy the content of Webpacker **boilerplate** folder into your theme folder.

## 3. Add entry assets

Look for the new **webpack-config.js** file in your theme folder then add your entry assets to the **entryFiles** array.

## 4. Load assets in your theme

You can now use [Webpacker Tags](#tags) to load assets in your theme.

Webpacker Tags are similar to Statamic **`theme:css`** and **`theme:js`** tags.
They also return an **url** or generate a **tag**.

It's just done a different way to seamlessly connect Statamic with Webpack.

> INFO: Please have a look to the Tags section for more informations.

## 5. Install dependencies

To install the dependencies please run the following command from your theme folder.

```bash
npm run setup
```

## 6. Launch Webpacker

Now you can launch Webpacker from your theme folder in one of the two modes:

### The development mode
Build assets and start a browsersync development serve with hot-reload

```bash
npm run webpacker:dev
```

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/terminal_mode_dev.png)

### The production mode
Build, minify and optimise assets for a production server

```bash
npm run webpacker:prod
```

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/terminal_mode_prod.png)

Hell yeah!!! You can now switch from developement to production and vice versas without any hassle. Just `npm run my_desires` and drink a coffee 🤘!

# 🌈 Tags

## webpacker:base

⚠️ This tag must be use once in your template if you want to use code splitting!

### Usage

```
{{ webpacker:base }}
```

``` .language-output
<script src="/user/themes/mytheme/js/manifest.js" defer></script> <!--  if enabled in settings -->
<script src="/user/themes/mytheme/js/vendors.js" defer></script> <!--  if enabled in settings -->
<script src="/user/themes/mytheme/js/commons.js" defer></script> <!--  if enabled in settings -->
```

### Parameters

The `{{ webpacker:base }}` tag takes parameters from [Webpacker Settings](#settings) in control panel.

**`Control Panel`** => **`Addons`** => **`Webpacker`** => **`Code Splitting`**

## webpacker:js

### Usage

```
{{ webpacker:js src="main" tag="true" attr="defer" }}
```

``` .language-output
<script src="/user/themes/mytheme/js/commons.js" defer></script>
```

### Parameters

| key | value | default |
|:----:|----------------------------------------------------------------------------------------------------------------|:-------:|
| src | The name of your entry file in **webpack-config.js** | null |
| tag | **false** to output the asset path // **true** to output a script tag // **inline** to output the script inline | false |
| attr | async // defer | null |

## webpacker:css

### Usage

```
{{ webpacker:css src="style" tag="true" }}
```

``` .language-output
<link rel="stylesheet" href="/site/themes/mytheme/css/style.css" />
```

### Parameters

| key | value | default |
|:----:|-------------------------------------------------------------------------------------------------------------|:-------:|
| src | The name of your entry file in **webpack-config.js** | null |
| tag | **false** to output the asset path // **true** to output a link tag // **inline** to output the style inline | false |

# 📐 Settings

## 🚸 Dev server

### Proxy

The php server domain where Statamic is running ('e.g. http(s)://domain_name.test')

### HTTPS

Toggle HTTPS on server with HTTP2

### SSL certificates

Toggle SSL certificates to prevent browser security message

> INFO: To use the SSL certificate provide by this addon you must add it as root certificates on you local machine. You can do that by running the following commands from the Webpacker addon directory.

##### Mac OS X

```bash
sudo security add-trusted-cert -p ssl -d -r trustRoot -k /Library/Keychains/System.keychain certs/localhost.crt
```

##### Windows

```bash
certutil -addstore -f "ROOT" certs/localhost.crt
```

## 💻 Web browser

### Open website

Open website on default web browser after initialization.

### Web browser

If you want to use a different web browser for development than the system default. You can choose between 6 options:

* **Default**
* **Google Chrome**
* **Safari**
* **Firefox**
* **Opera**
* **Internet Explorer**

### Console

How coding errors, linting errors and webpack runtime errors must be display in the web browser console.

You can choose between 2 options:

* **display errors**: _display errors in the web browser console._
* **display warnings**: _display warnings in the web browser console._

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/browser_console.png)

### Overlay

How coding errors, linting errors and webpack runtime errors must be display in the web browser overlay.

You can choose between 2 options:

* **display errors**: _display errors in the web browser overlay._
* **display warnings**: _display warnings in the web browser overlay._

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/browser_overlay.png)

### Overlay theme

The theme for the the web browser overlay.

Because it's nice to dim the light when working late, you can choose between 2 themes:

* **light** ☀️
* **dark** 🌑

## 🔨 Tools

### BrowserSync UI

Open BrowserSync UI on the default web browser after initialization.

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/browsersync_ui.png)

### BundleAnalyzer

Open BundleAnalyzer on the default web browser after initialization.

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/bundleanalyzer.png)

## 🔔 Notifications

### OS Notification

Toggle OS notification.

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/notification_compilation.png)
![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/notification_success.png)
![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/notification_error.png)

### OS Notification sound

Toggle OS Notification sound.

### BrowserSync notification

Toggle BrowserSync status popup.

![](https://raw.githubusercontent.com/jimblue/statamic-addon-webpacker/master/img/browsersync_popup.png)

## 📁 Files

### Output folder

The output folder name to render assets.

### Development source maps

You can choose between 5 modes:

* **(none)**
* **eval**
* **eval-source-map**
* **cheap-eval-source-map**
* **cheap-module-eval-source-map**

> INFO: please refer to webpack documentation to choose your settings https://webpack.js.org/configuration/devtool/

### Production source maps

You can choose between 4 modes:

* **(none)**
* **source-map**
* **hidden-source-map**
* **nosources-source-map**

> INFO: please refer to webpack documentation to choose your settings https://webpack.js.org/configuration/devtool/

## 🔪 Code Splitting

### Manifest

Move webpack runtime code to a separate manifest.js file in order to support long-term caching. This will avoid hash recreation for other files when only application files are changed.

### Vendors

Move node_modules vendors to a separate vendors.js file in order to support long-term caching. This will avoid hash recreation for other files when only application files are changed

### Commons

Move modules used in multiple assets to a separate commons.js file in order to support long-term caching. This will avoid hash recreation for other files when only application files are changed

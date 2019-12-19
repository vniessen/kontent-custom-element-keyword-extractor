# Kentico Kontent Custom Element: Keyword Extractor

This [custom element](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features) for [Kentico Kontent](https://kontent.ai) gives editors a way to automatically generate keywords for an item based on the content in it. It's based on [VueJS](https://vuejs.org/) to enable more dynamic functionality.

## Features

- Editors can selectively remove keywords
- Editors can manually refresh the keywords
- Multiple keyword extraction options:
  - [Javascript implementation](https://github.com/sleepycat/rapid-automated-keyword-extraction) of the RAKE (rapid automatic keyword extraction) algorithm
  - [Microsoft Azure Text Analytics](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/) API
- Optional debug panel for diagnostics

## Quick testing
If you're interested in trying this out without deploying it yourself, you can use <https://kontent-custom-element-keyword-extractor.netlify.com/>. This is the deployed version of the master branch in this repo. **This should only be used for quick testing as it is subject to change**

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ChristopherJennings/kontent-custom-element-keyword-extractor)

## Configuring the Custom Element

You will need to add the custom element to a content type filling in the hosted code URL and the JSON parameters (see below for details). You will also need to allow the custom element to read the values of the elements you want to base keywords off of.

The JSON parameters required as as follows:

| Name | Value | Description |
| ---- | ----- | ----------- |
|elements|array| (Required) This is the array of element codenames to extract keywords from. The specified elements must also be set as readable for the custom element. |
|azureKey|string| (Optional) This is the [access key](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows#get-the-keys-for-your-resource) for your Microsoft Azure Text Analytics resource. If not provided the local Javascript extractor is used instead. |
|debug|boolean| (Optional) If present and set to true the debug panel will activate when editing a content item. |

```json
{
    "elements": [
        "summary",
        "meta_keywords",
        "title"
    ],
    "azureKey": "<YOUR_AZURE_ACCESS_KEY>",
    "debug": true
}
```

## Developing

### Initial project setup

```console
npm install
```

### Compiles and hot-reloads for development

```console
npm run serve
```

### Compiles and minifies for production

```console
npm run build
```

### Lints and fixes files

```console
npm run lint
```

### Customize Vue CLI configuration

See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).

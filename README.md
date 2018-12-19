# onenote-markdown

This is a new prototype for building a markdown editor for OneNote, starting with the editor.

Documentation: https://github.com/dalyIsaac/onenote-markdown/wiki

## Why a new project?

The main reason is that the previous attempt wasn't written with full code coverage, and going back to rectify that was painful. There were also some fundamentally bad architectural decisions - like sending multitudes of unnecessary requests to the Microsoft Graph at once.

This attempt starts with building the editor first, instead of the Microsoft Graph interface. The editor is the most complex component, and thus should be a good starting point.

However, starting from scratch doesn't mean that the old project will be completely ignored - bits and pieces will provide "inspiration" when needed.

Link to old project: [https://github.com/dalyIsaac/onenote-markdown-old](https://github.com/dalyIsaac/onenote-markdown-old)

## Prerequisites

- [Node.js and npm](https://nodejs.org/)
- [git](https://git-scm.com/downloads)

## Getting the source

Clone the repo

```shell
git clone https://github.com/dalyIsaac/onenote-markdown-prototype.git
```

## Install the dependencies

```shell
cd onenote-markdown
npm install
```

## Run dev build

```shell
npm start
```

## Build production

```shell
npm build
```

## Jest testing

```Shell
npm test
```

## Debugging in VSCode

Install the [Chrome debugger](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

`/vscode/launch.json`

```Javascript
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}"
        },
        {
            "type": "chrome",
            "request": "attach",
            "name": "Attach to Chrome against localhost",
            "port": 9222,
            "url": "localhost:3000",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

To attach to an existing Chrome instance, ensure that Chrome from the command line as:

Windows

```shell
<path to chrome>/chrome.exe --remote-debugging-port=9222
```

macOS

```shell
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

Linux

```shell
google-chrome --remote-debugging-port=9222
```

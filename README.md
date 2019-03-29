<div align="center">

[![GitHub license](https://img.shields.io/github/license/teimurjan/sync-query-redux.svg)](https://github.com/teimurjan/react-gistlab/blob/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/react-gistlab.svg)](https://www.npmjs.com/package/react-gistlab)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-gistlab.svg)

</div>

The library is created for using Github gists and Gitlab snippets in your React application.

## Installation

Installation can be done with [npm](https://www.npmjs.com/)

```sh
npm install --save react-gistlab
```

or [yarn](https://yarnpkg.com/en/)

```sh
yarn add react-gistlab
```

## Usage

### Github gists

```jsx
import * as React from "react";

import { GithubGist } from "react-gistlab";

import s from "./CodeSnippet.scss";

const CodeSnippet = () => (
  <div className={s.CodeSnippet}>
    <GithubGist
      url="https://gist.github.com/teimurjan/5dcc351c06f5b67e403d37c10dd88634#file-dto-py.json"
      Loading={() => <p>LOADING!</p>}
    />
  </div>
);
```

### Gitlab snippet

### ⚠️⚠️⚠️ **WARNING** ⚠️⚠️⚠️

Be careful in using it in production!

[Gitlab](http://gitlab.com/) uses `document.write` in their snippets, that's why the snippet not working directly in SPAs. Fetching their snippet directly is blocked by CORS. That's why you should use a disable cors proxy for fetching the snippet. By default it's [cors.io](https://cors.io/?). In order to be safe from XSS, you will need to have your own proxy!

```jsx
import * as React from "react";

import { GitlabSnippet } from "react-gistlab";

import s from "./CodeSnippet.scss";

const CodeSnippet = () => (
  <div className={s.CodeSnippet}>
    <GitlabSnippet
      url="https://gitlab.com/snippets/1839780"
      Loading={() => <p>LOADING!</p>}
      corsProxyURL="https://your.own.proxy/?"
    />
  </div>
);
```

## Plans

- [ ] Add tests
- [ ] Set up CI/CD

## Contributions

Contributors are welcome. Please discuss new features and submit PRs for bug fixes with tests.
Run `npm run build` which detects type errors, tests passing status and build the lib if everything is well.

## License

[MIT](./blob/master/LICENSE.md)

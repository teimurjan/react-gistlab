import * as React from 'react';

import {
  IGitlabSnippetInfo as IInfo,
  IGitlabSnippetProps as IProps,
  IGitlabSnippetState as IState
} from '../index';

const GITLAB_SNIPPETS_BASE_URL = 'https://gitlab.com/snippets';
const DEFAULT_CORS_PROXY_URL = 'https://cors.io/?';
const GITLAB_SNIPPET_URL_REGEX = /^https:\/\/gitlab\.com\/snippets\/([0-9a-z]*)/;
const GITLAB_SNIPPET_REGEX = /document\.write\(\'(.*)\'\)/;

const getInfo = (url: string): IInfo => {
  const match = url.match(GITLAB_SNIPPET_URL_REGEX);

  if (!match || match.length < 2) {
    throw new Error(`Invalid snippet url: ${url}`);
  }

  const [_, snippetID] = match;

  return { snippetID };
};

const getSnippetHTML = (responseText: string) => {
  const lines = responseText.split('\n');

  if (lines.length < 3) {
    return {
      css: '',
      html: ''
    };
  }

  const [css, html] = lines.map(line => {
    const match = line.match(GITLAB_SNIPPET_REGEX);
    if (!match || match.length < 2) {
      return '';
    }

    return match[1];
  });

  const cssHrefMatch = css.match(/href=\\"(.*)\\"/);
  const cssHref =
    cssHrefMatch && cssHrefMatch.length > 1 ? cssHrefMatch[1] : '';

  return {
    css: cssHref,
    html: unescapeHTML(html)
  };
};

const unescapeHTML = (html: string) =>
  html
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '')
    .replace(/\\\//g, '/');

class GitlabSnippet extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    corsProxyURL: DEFAULT_CORS_PROXY_URL
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoading: true,
      data: undefined,
      info: getInfo(props.url)
    };
  }

  componentDidMount() {
    this.getSnippet();
  }

  componentWillUnmount() {
    const { data, info } = this.state;

    if (data) {
      const stylesheet = document.getElementById(
        `gitlab-snippet-style-${info.snippetID}`
      );

      if (stylesheet) {
        stylesheet.remove();
      }
    }
  }

  getSnippet = () => {
    const { info } = this.state;
    const { corsProxyURL } = this.props;

    const url = `${corsProxyURL}${GITLAB_SNIPPETS_BASE_URL}/${
      info.snippetID
    }.js`;

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        const { css, html } = getSnippetHTML(request.responseText);

        this.addSnippetToDOM(css, html);
      }
    };
  };

  addSnippetToDOM = (css: string, html: string) => {
    const { info } = this.state;

    const htmlID = `gitlab-snippet-style-${info.snippetID}`;

    const isStylesheetAdded = !!document.getElementById(htmlID);

    if (!isStylesheetAdded) {
      const link = document.createElement('link');

      link.href = css;
      link.id = htmlID;
      link.type = 'text/css';
      link.rel = 'stylesheet';

      document.head.appendChild(link);
    }

    this.setState({ data: html, isLoading: false });
  };

  render() {
    const { isLoading, data } = this.state;
    const { Loading } = this.props;

    if (isLoading) {
      return Loading ? <Loading /> : null;
    }

    if (data) {
      return <div dangerouslySetInnerHTML={{ __html: data }} />;
    }

    return null;
  }
}

export default GitlabSnippet;

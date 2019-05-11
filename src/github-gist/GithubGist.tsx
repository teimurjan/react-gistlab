import * as React from 'react';

import {
  IGithubGistProps as IProps,
  IGithubGistState as IState,
  IGithubGistData as IData,
  IGithubGistInfo as IInfo
} from '../../index';
import {
  isDocumentDefined,
  isWindowDefined,
  warnNoWindowOrDocument,
  Counter
} from '../utils';

const GIST_BASE_URL = 'https://gist.github.com';
const GIST_REGEX = /^https:\/\/gist\.github\.com\/(.*)\/([0-9a-z]*)/;

/**
 * Global counter to have unique identifiers for every component
 * */
const counter = new Counter();

/**
 * Parses information from gist URL
 * */
export const getGistInfoFromURL = (url: string): IInfo => {
  const match = url.match(GIST_REGEX);

  if (!match || match.length < 3) {
    throw new Error(`Invalid gist url: ${url}`);
  }

  const [_, username, gistID] = match;

  const filename = getFileName(url);

  return { username, gistID, filename };
};

/**
 * Gets targeting filename from the URL
 * */
export const getFileName = (url: string) => {
  const fileAnchor = url.split('#').pop();

  if (fileAnchor && fileAnchor.match(/file-/) !== null) {
    return `${fileAnchor.replace('file-', '').replace('-', '.')}`;
  }

  return undefined;
};

/**
 * Gets unique id attribute for <script> element
 * */
export const getScriptID = (info: IInfo) => `gist_script_${getUniqueID(info)}`;

/**
 * Gets unique callback name
 * */
export const getCallbackName = (info: IInfo) =>
  `gist_callback_${getUniqueID(info)}`;

/**
 * Gets unique ID for a gist with the info given
 * */
export const getUniqueID = ({ gistID, filename }: IInfo) =>
  `${counter.next()}_${gistID}${
    filename ? `__${filename.replace(/[^0-9A-z]/g, '')}` : ''
  }`;

/**
 * Gets query params for gist URL
 * */
export const getQueryParams = (
  filename: string | undefined,
  callbackName: string
): Array<string> => [
  ...(filename ? [`file=${filename}`] : []),
  `callback=${callbackName}`
];

/**
 * Gets gist URL with the given information about the gist and query params
 * */
export const getGistURL = (info: IInfo, queryParams: Array<string>) => {
  return `${GIST_BASE_URL}/${info.username}/${
    info.gistID
  }.json?${queryParams.join('&')}`;
};

/**
 * Adds script to the document
 * */
export const addScriptToDocument = (src: string, id: string) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.id = id;
  document.head.appendChild(script);
};

/**
 * Checks whether the stylesheet is already added
 * */
export const isStylesheetAdded = (stylesheetHref: string) =>
  !!document.querySelector(`head link[href="${stylesheetHref}"]`);

/**
 * Adds stylesheet to the document
 * */
export const addStylesheetToDocument = (href: string) => {
  const stylesheet = document.createElement('link');
  stylesheet.type = 'text/css';
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  document.head.appendChild(stylesheet);
};

/**
 * There is a problem when copying a URL from the browser's address bar.
 * The URL for a file named with uppercase letters will ignore the case.
 * This function checks whether the filename from URL is in invalid case when compared with the actual filename.
 * */
export const isURLFilenameInvalidCase = (
  filenameFromURL: string,
  actualFilename: string
) =>
  actualFilename.toLowerCase() === filenameFromURL &&
  actualFilename !== filenameFromURL;

/**
 * Gets gist's data
 * */
export const getGistData = (info: IInfo) =>
  new Promise<IData>(resolve => {
    const scriptID = getScriptID(info);

    const callbackName = getCallbackName(info);

    (window as any)[callbackName] = (data: IData) => {
      const script = document.getElementById(scriptID);
      if (script) {
        script.remove();
      }

      resolve(data);

      (window as any)[callbackName] = undefined;
    };

    const queryParams = getQueryParams(info.filename, callbackName);
    const url = getGistURL(info, queryParams);
    addScriptToDocument(url, scriptID);
  });

/**
 * Gets the data for the whole gist(may contain multiple files)
 * */
export const getWholeGistData = (info: IInfo) =>
  getGistData({ ...info, filename: undefined });

/**
 * Gets the data for the only file in a gist
 * */
export const getGistFileData = (info: IInfo) => getGistData(info);

class GithubGist extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoading: true,
      data: undefined,
      info: getGistInfoFromURL(props.url)
    };

    if (!isDocumentDefined() || !isWindowDefined()) {
      warnNoWindowOrDocument();
      return;
    }

    this.init();
  }

  async init() {
    const { info } = this.state;

    const filenameFromURL = info.filename;
    const gistData = await getWholeGistData(info);

    if (filenameFromURL) {
      this.updateFilenameCaseIfNeeded(gistData.files);
      this.fetchGistFile();
    } else {
      this.setData(gistData);
    }
  }

  componentWillUnmount() {
    if (!isDocumentDefined() || !isWindowDefined()) {
      warnNoWindowOrDocument();
      return;
    }

    this.destroy();
  }

  destroy() {
    const { data } = this.state;

    if (data) {
      const stylesheet = document.querySelector(
        `head link[href="${data.stylesheet}"]`
      );

      if (stylesheet) {
        stylesheet.remove();
      }
    }
  }

  async fetchGistFile() {
    const { info } = this.state;

    const gistFileData = await getGistFileData(info);
    this.setData(gistFileData);
  }

  setData(data: IData) {
    this.setState({
      isLoading: false,
      data
    });

    if (!isStylesheetAdded(data.stylesheet)) {
      addStylesheetToDocument(data.stylesheet);
    }
  }

  updateFilenameCaseIfNeeded = (gistFiles: string[]) => {
    const { info } = this.state;

    gistFiles.forEach(filename => {
      if (info.filename && isURLFilenameInvalidCase(info.filename, filename)) {
        this.setState({
          info: {
            ...info,
            filename
          }
        });
      }
    });
  };

  render() {
    const { isLoading, data } = this.state;
    const { Loading } = this.props;

    if (isLoading) {
      return Loading ? <Loading /> : null;
    }

    if (data) {
      return <div dangerouslySetInnerHTML={{ __html: data.div }} />;
    }
  }
}

export default GithubGist;

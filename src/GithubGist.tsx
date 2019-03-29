import * as React from 'react';

import {
  IGithubGistProps as IProps,
  IGithubGistState as IState,
  IGithubGistData as IData,
  IGithubGistInfo as IInfo
} from '../index';

const GIST_BASE_URL = 'https://gist.github.com';
const GIST_REGEX = /^https:\/\/gist\.github\.com\/(.*)\/([0-9a-z]*)/;

const getInfo = (url: string): IInfo => {
  const match = url.match(GIST_REGEX);

  if (!match || match.length < 3) {
    throw new Error(`Invalid gist url: ${url}`);
  }

  const [_, username, gistID] = match;

  const filename = getFileName(url);

  return { username, gistID, filename };
};

const getFileName = (url: string) => {
  const fileAnchor = url.split('#').pop();

  if (fileAnchor && fileAnchor.match(/file-/) !== null) {
    return `${fileAnchor.replace('file-', '').replace('-', '.')}`;
  }

  return undefined;
};

const getCallbackName = ({ gistID, filename }: IInfo) =>
  `gist_callback_${gistID}${filename ? `__${filename}` : ''}`;

class GithubGist extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoading: true,
      data: undefined,
      info: getInfo(props.url)
    };

    this.initCallback();
  }

  componentDidMount() {
    this.addScriptTag();
  }

  componentWillUnmount() {
    const { data, info } = this.state;

    if (data) {
      const stylesheet = document.querySelector(
        `head link[href="${data.stylesheet}"]`
      );

      if (stylesheet) {
        stylesheet.remove();
      }
    }

    const script = document.getElementById(`gist_script_${info.gistID}`);
    if (script) {
      script.remove();
    }
  }

  initCallback = () => {
    const { info } = this.state;

    (window as any)[getCallbackName(info)] = (data: IData) => {
      this.setState({
        isLoading: false,
        data
      });

      const isStylesheetAdded =
        document.querySelectorAll(`head link[href="${data.stylesheet}"]`)
          .length === 0;
      if (isStylesheetAdded) {
        const stylesheet = document.createElement('link');
        stylesheet.type = 'text/css';
        stylesheet.rel = 'stylesheet';
        stylesheet.href = data.stylesheet;
        document.head.appendChild(stylesheet);
      }
    };
  };

  addScriptTag = () => {
    const script = document.createElement('script');

    const { info } = this.state;

    const queryParams = [
      ...(info.filename ? [`file=${info.filename}`] : []),
      `callback=${getCallbackName(info)}`
    ];

    const url = `${GIST_BASE_URL}/${info.username}/${
      info.gistID
    }.json?${queryParams.join('&')}`;

    script.type = 'text/javascript';
    script.src = url;
    script.id = `gist_script_${info.gistID}`;

    document.head.appendChild(script);
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

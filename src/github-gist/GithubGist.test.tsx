import * as React from 'react';
import { shallow } from 'enzyme';

import GithubGist, {
  getCallbackName,
  getFileName,
  getInfo
} from './GithubGist';

test('creates state correctly', () => {
  const username = 'test';
  const gistID = 'gist12345';

  const gist = shallow(
    <GithubGist url={`https://gist.github.com/${username}/${gistID}`} />
  );

  expect(gist.state()).toEqual({
    isLoading: true,
    data: undefined,
    info: {
      username,
      gistID,
      filename: undefined
    }
  });
});

test('initializes callback', () => {
  const username = 'test';
  const gistID = 'gist12345';

  shallow(<GithubGist url={`https://gist.github.com/${username}/${gistID}`} />);

  const callback = (window as any)[
    getCallbackName({ gistID, username, filename: undefined })
  ];

  expect(callback).toBeDefined();
  expect(callback).toBeInstanceOf(Function);
});

test('renders null when no Loading component passed', () => {
  const username = 'test';
  const gistID = 'gist12345';

  const gist = shallow(
    <GithubGist url={`https://gist.github.com/${username}/${gistID}`} />
  );

  expect(gist.type()).toBeNull();
});

test('renders Loading when it is passed', () => {
  const username = 'test';
  const gistID = 'gist12345';

  const Loading = () => <p>Loading...</p>;

  const gist = shallow(
    <GithubGist
      url={`https://gist.github.com/${username}/${gistID}`}
      Loading={Loading}
    />
  );

  expect(gist.type()).toEqual(Loading);
});

test('renders div with innerHTML when data exists', () => {
  const username = 'test';
  const gistID = 'gist12345';

  const Loading = () => <p>Loading...</p>;

  const gist = shallow(
    <GithubGist
      url={`https://gist.github.com/${username}/${gistID}`}
      Loading={Loading}
    />
  );

  const newState = {
    data: { div: '<div>Test</div>' },
    isLoading: false
  };

  gist.setState(newState);

  expect(gist.type()).toEqual('div');
  expect(gist.props()).toEqual({
    dangerouslySetInnerHTML: { __html: newState.data.div }
  });
});

test('gets filename correctly', () => {
  const filename = 'file-test-js';
  const url = `https://gist.github.com/test/123#${filename}`;

  expect(getFileName(url)).toEqual('test.js');
});

test('gets callback name correctly', () => {
  const filename = 'file.js';
  const gistID = '123';
  const username = 'test';

  expect(getCallbackName({ gistID, filename, username })).toEqual(
    `gist_callback_${gistID}__${filename.replace(/[^0-9A-z]/g, '')}`
  );
});

test('gets info from url correctly', () => {
  const username = 'test';
  const gistID = 'gist12345';
  const filename = 'file-test-js';

  const url = `https://gist.github.com/${username}/${gistID}#${filename}`;

  expect(getInfo(url)).toEqual({
    username,
    gistID,
    filename: 'test.js'
  });
});

test('throws an error when gets info from incorrect url', () => {
  const url = 'invalid';

  expect(() => getInfo(url)).toThrow(Error);
});

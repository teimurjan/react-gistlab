import * as React from 'react';
import { shallow } from 'enzyme';

import GithubGist, {
  getCallbackName,
  getFileName,
  getGistInfoFromURL
} from './GithubGist';
import { getScriptID, getUniqueID } from '../../lib/github-gist/GithubGist';

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

test('gets unique id correctly', () => {
  const filename = 'file.js';
  const gistID = '123';
  const username = 'test';

  const uniqueID = getUniqueID({ gistID, filename, username });

  expect(uniqueID.slice(1)).toEqual(
    `_${gistID}__${filename.replace(/[^0-9A-z]/g, '')}`
  );

  expect(uniqueID.slice(0, 1).match(/^\d+$/)).not.toHaveLength(0);
});

test('gets script id name correctly', () => {
  const filename = 'file.js';
  const gistID = '123';
  const username = 'test';

  const scriptID = getScriptID({ gistID, filename, username });

  expect(scriptID.slice(0, 12)).toEqual(`gist_script_`);

  expect(scriptID.slice(12, 13).match(/^\d+$/)).not.toHaveLength(0);

  expect(scriptID.slice(13)).toEqual(
    `_${gistID}__${filename.replace(/[^0-9A-z]/g, '')}`
  );
});

test('gets callback name correctly', () => {
  const filename = 'file.js';
  const gistID = '123';
  const username = 'test';
  
  const callbackName = getCallbackName({ gistID, filename, username });

  expect(callbackName.slice(0, 14)).toEqual(`gist_callback_`);

  expect(callbackName.slice(14, 15).match(/^\d+$/)).not.toHaveLength(0);

  expect(callbackName.slice(15)).toEqual(
    `_${gistID}__${filename.replace(/[^0-9A-z]/g, '')}`
  );
});

test('gets info from url correctly', () => {
  const username = 'test';
  const gistID = 'gist12345';
  const filename = 'file-test-js';

  const url = `https://gist.github.com/${username}/${gistID}#${filename}`;

  expect(getGistInfoFromURL(url)).toEqual({
    username,
    gistID,
    filename: 'test.js'
  });
});

test('throws an error when gets info from incorrect url', () => {
  const url = 'invalid';

  expect(() => getGistInfoFromURL(url)).toThrow(Error);
});

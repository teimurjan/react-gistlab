import * as React from 'react';
import { shallow } from 'enzyme';

import GitlabSnippet, { getInfo } from './GitlabSnippet';

test('creates state correctly', () => {
  const snippetID = 'snippet12345';

  const snippet = shallow(
    <GitlabSnippet url={`https://gitlab.com/snippets/${snippetID}`} />
  );

  expect(snippet.state()).toEqual({
    isLoading: true,
    data: undefined,
    info: { snippetID }
  });
});

test('gets snippet correctly', () => {
  const fakeRequest = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    readyState: 4,
    status: 200,
    responseText: `document.write('<link type=\"text/css\" href=\"somewhere.css\"><\/link>');\ndocument.write('<p class=\"test\">Test<\/p>');`
  };

  const xhrMockClass = () => fakeRequest;

  (window as any).XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

  const snippetID = 'snippet12345';

  const url = `https://gitlab.com/snippets/${snippetID}`;
  const corsProxyURL = `https://cors.test`;

  const snippet = shallow(
    <GitlabSnippet url={url} corsProxyURL={corsProxyURL} />
  );

  expect(fakeRequest.open).toBeCalledWith('GET', `${corsProxyURL}${url}.js`);
  expect(fakeRequest.send).toBeCalled();

  fakeRequest.onreadystatechange();

  expect(snippet.state()).toEqual({
    data: '<p class="test">Test</p>',
    info: { snippetID },
    isLoading: false
  });
});

test('renders null when no Loading component passed', () => {
  const snippetID = 'snippet12345';

  const snippet = shallow(
    <GitlabSnippet url={`https://gitlab.com/snippets/${snippetID}`} />
  );

  expect(snippet.type()).toBeNull();
});

test('renders Loading when it is passed', () => {
  const snippetID = 'snippet12345';

  const Loading = () => <p>Loading...</p>;

  const snippet = shallow(
    <GitlabSnippet
      url={`https://gitlab.com/snippets/${snippetID}`}
      Loading={Loading}
    />
  );

  expect(snippet.type()).toEqual(Loading);
});

test('renders div with innerHTML when data exists', () => {
  const snippetID = 'snippet12345';

  const Loading = () => <p>Loading...</p>;

  const snippet = shallow(
    <GitlabSnippet
      url={`https://gitlab.com/snippets/${snippetID}`}
      Loading={Loading}
    />
  );

  const newState = {
    data: '<div>Test</div>',
    isLoading: false
  };

  snippet.setState(newState);

  expect(snippet.type()).toEqual('div');
  expect(snippet.props()).toEqual({
    dangerouslySetInnerHTML: { __html: newState.data }
  });
});

test('gets info from url correctly', () => {
  const snippetID = 'snippet12345';

  const url = `https://gitlab.com/snippets/${snippetID}`;

  expect(getInfo(url)).toEqual({ snippetID });
});

test('throws an error when gets info from incorrect url', () => {
  const url = 'invalid';

  expect(() => getInfo(url)).toThrow(Error);
});

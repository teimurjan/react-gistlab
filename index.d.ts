import * as React from 'react';

interface IGithubGistProps {
  url: string;
  Loading?: React.StatelessComponent | React.ComponentClass;
}

interface IGithubGistInfo {
  gistID: string;
  username: string;
  filename?: string;
}

interface IGithubGistData {
  div: string;
  files: string[];
  stylesheet: string;
}

interface IGithubGistState {
  isLoading: boolean;
  data?: IGithubGistData;
  info: IGithubGistInfo;
}

declare class GithubGist extends React.Component<
  IGithubGistProps,
  IGithubGistState
> {}

interface IGitlabSnippetProps {
  url: string;
  Loading?: React.StatelessComponent | React.ComponentClass;
  corsProxyURL?: string,
}

interface IGitlabSnippetInfo {
  snippetID: string;
}


interface IGitlabSnippetState {
  isLoading: boolean;
  data?: string;
  info: IGitlabSnippetInfo;
}

declare class GitlabSnippet extends React.Component<
  IGitlabSnippetProps,
  IGitlabSnippetState
> {}

declare module 'react-gistlab' {}

export {
  GithubGist,
  IGithubGistProps,
  IGithubGistState,
  IGithubGistInfo,
  IGithubGistData,
  GitlabSnippet,
  IGitlabSnippetProps,
  IGitlabSnippetState,
  IGitlabSnippetInfo,
};

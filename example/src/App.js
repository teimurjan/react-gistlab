import React from "react";

import { GithubGist, GitlabSnippet } from "@lib/index";

const Loading = () => "Loading..."

function App() {
  return (
    <div className="App">
      <h2>Github: all files in a gist</h2>
      <GithubGist
        url="https://gist.github.com/teimurjan/69e727929d6bd558d6e0d663bcc4427b"
        Loading={Loading}
      />
      <h2>Github: single file from a gist</h2>
      <GithubGist
        url="https://gist.github.com/teimurjan/69e727929d6bd558d6e0d663bcc4427b#file-1-js"
        Loading={Loading}
      />
      <h2>Gitlab: all files in a snippet</h2>
      <GitlabSnippet
        url="https://gitlab.com/-/snippets/2095817"
        Loading={Loading}
        corsProxyURL="https://cors-anywhere.herokuapp.com/"
      />
    </div>
  );
}

export default App;

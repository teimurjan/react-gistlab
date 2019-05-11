import React from "react";

import { GithubGist } from "@lib/index";

function App() {
  return (
    <div className="App">
      <GithubGist
        url="https://gist.github.com/JamieFarrelly/60f18768e48452f2e7ff498b5271efcc#file-constants-java"
        Loading={() => "Loading..."}
      />
      <GithubGist
        url="https://gist.github.com/JamieFarrelly/60f18768e48452f2e7ff498b5271efcc"
        Loading={() => "Loading..."}
      />
    </div>
  );
}

export default App;

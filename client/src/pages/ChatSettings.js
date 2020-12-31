import React from 'react';
import { useParams } from 'react-router';

export default function ChatSettings() {
  let { projectId } = useParams();

  const displayCode = (projectId) => {
    return (
      <pre>
        &lt;
          <span>script</span>
        &gt;
        <br/>
          var a = document.createElement("script"),<br/>
              h = "head";<br/>
          a.async = true;<br/>
          a.src = (document.location.protocol == "https:" ? "https:" : "http:") + "//localhost:3000" + `/api/{projectId}/widget.js`<br/>
          document.getElementsByTagName(h)[0].appendChild(a)<br/>
        &lt;
          <span>/script</span>
        &gt;
      </pre>
    );
  };

  return (
    <>
    hello man
    {displayCode(projectId)}  
    </>
  );
}
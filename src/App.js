import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GLBViewer from "./components/GLBViewer";

const App = () => {
  return (
    <div className="container">
      <header className="App-header">
        <h1 className="my-0">GLB Viewer</h1>
      </header>
      <GLBViewer />
    </div>
  );
};

export default App;

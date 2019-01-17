import React from "react";
import ReactJSONTree from "react-json-tree";

const theme = {
  base00: "#000000",
  base09: "#ffffff", // numbers
  base0B: "#ffffff", // strings
  base0D: "#888" // keys
};

export const JSONTree = ({ data }) => {
  const hideRoot = Object.keys(data).length <= 5;
  return (
    <ReactJSONTree
      data={data}
      theme={theme}
      getItemString={() => null}
      hideRoot={hideRoot}
      shouldExpandNode={() => false}
      labelRenderer={keyPath => {
        const first = keyPath[0];
        return keyPath.length === 1 && first === "root" ? (
          <span style={{ fontStyle: "italic" }}>Object</span>
        ) : (
          first
        );
      }}
    />
  );
};

import React, { Fragment } from "react";

import cx from "classnames";
import alphanumSort from "alphanum-sort";

function sort(items: string[]): string[] {
  return alphanumSort(items, { insensitive: true });
}

export interface TreeData {
  [key: string]: TreeData;
}

type ExpansionEntry = [boolean, ExpansionState];

export interface ExpansionState {
  [key: string]: ExpansionEntry;
}

interface Props {
  data: TreeData;
  expansion: ExpansionState;
  onChangeExpansion: (state: ExpansionState) => void;
  renderLeaf: (path: string[]) => React.ReactNode;
  expandAll?: boolean;
}

export default function TreeView(props: Props) {
  const { data, expansion, renderLeaf, expandAll } = props;
  const sortedNames = sort(Object.keys(data));

  const items = sortedNames.map(key => {
    const subData = data[key];
    const subExpansion = expansion[key];

    const isExpanded = expandAll || (subExpansion != null && subExpansion[0]);
    const isLeaf = Object.keys(subData).length === 0;

    const subTree = isExpanded ? (
      <TreeView
        data={subData}
        expansion={expandAll ? {} : subExpansion[1]}
        renderLeaf={path => renderLeaf([key, ...path])}
        onChangeExpansion={state => {
          const newEntry: ExpansionEntry = [isExpanded, state];
          const newState = { ...expansion, [key]: newEntry };
          props.onChangeExpansion(newState);
        }}
        expandAll={expandAll}
      />
    ) : null;

    const inner = isLeaf ? (
      renderLeaf([key])
    ) : (
      <Fragment>
        <span className={cx("expander-arrow", { expanded: isExpanded })} />
        {key} {isExpanded && subTree}
      </Fragment>
    );

    return (
      <li
        key={key}
        onClick={event => {
          event.stopPropagation();
          props.onChangeExpansion({
            ...expansion,
            [key]: [!isExpanded, subExpansion ? subExpansion[1] : {}]
          });
        }}
      >
        {inner}
      </li>
    );
  });

  return <ul>{items}</ul>;
}

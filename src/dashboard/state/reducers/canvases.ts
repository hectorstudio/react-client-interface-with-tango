interface ICanvas {
  id: string;
  name: string;
}

export interface ICanvasesState {
  [id: string]: ICanvas;
}

const initialState = {
  "0": {
    id: "0",
    name: "Root",
  },
  "1": {
    id: "1",
    name: "Subcanvas 1",
  },
  "2": {
    id: "2",
    name: "Subcanvas 2",
  },
  "3": {
    id: "3",
    name: "Subcanvas 3",
  }
};

export default function canvases(state: ICanvasesState = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

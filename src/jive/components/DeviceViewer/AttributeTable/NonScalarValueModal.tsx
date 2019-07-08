import React, { useEffect, useState, useRef } from "react";

import TangoAPI from "../../../state/api/tango";
import Modal from "../../../../shared/modal/components/Modal/Modal";

import PlotlyCore from "plotly.js/lib/core";
import PlotlyScatter from "plotly.js/lib/scatter";
import createPlotlyComponent from "react-plotly.js/factory";
PlotlyCore.register([PlotlyScatter]);
const Plotly = createPlotlyComponent(PlotlyCore);

type NumericSpectrum = number[];
type NumericImage = number[][];
type BooleanSpectrum = boolean[];
type BooleanImage = boolean[][];

interface ImageDisplayProps {
  value: BooleanImage | NumericImage;
}

function ImageDisplay(props: ImageDisplayProps) {
  const image = props.value;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const content = <canvas ref={canvasRef} />;

  if (canvasRef.current == null) {
    return content;
  }

  const width = image[0].length;
  const height = image.length;

  let max = Number(image[0][0]);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pixel = Number(image[x][y]);
      if (pixel > max) {
        max = pixel;
      }
    }
  }

  const context = canvasRef.current.getContext("2d");
  if (context == null) {
    return content;
  }

  const imgData = context.createImageData(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const value = image[x][y];
      const index = y * width * 4 + x * 4;
      const normal = 255 * (Number(value) / (max === 0 ? 1 : max));
      imgData.data[index + 0] = normal;
      imgData.data[index + 1] = normal;
      imgData.data[index + 2] = normal;
      imgData.data[index + 3] = 255;
    }
  }

  context.putImageData(imgData, 0, 0);
  return content;
}

interface SpectrumDisplayProps {
  value: NumericSpectrum | BooleanSpectrum;
  datatype: string;
}

function SpectumDisplay(props: SpectrumDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const x: number[] = [];
  const y: number[] = [];

  for (let i = 0; i < props.value.length; i++) {
    x.push(i);
    y.push(Number(props.value[i]));
  }

  const width =
    containerRef.current == null ? 0 : containerRef.current.offsetWidth;

  const layout = {
    font: { family: "Helvetica, Arial, sans-serif" },
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0
    },
    width
  };

  /* "hv" produces a step chart where the y value in the beginning of each segment corresponds to the y value of the data point */
  const shape = props.datatype === "DevBoolean" ? "hv" : "linear";

  return (
    <div ref={containerRef}>
      {width === 0 ? (
        "Loading..."
      ) : (
        <Plotly
          layout={layout}
          data={[{ x, y, line: { shape } }]}
          config={{ displayModeBar: false }}
        />
      )}
    </div>
  );
}

interface StringDisplayProps {
  value: string[] | string[][];
}

function StringDisplay(props: StringDisplayProps) {
  return (
    <pre style={{ height: "15em", overflow: "scroll" }}>
      {JSON.stringify(props.value, null, 2)}
    </pre>
  );
}

interface Props {
  tangoDB: string;
  device: string;
  attribute: string;
  dataformat: string;
  datatype: string;
  onClose: () => void;
}

export function NonScalarValueModal(props: Props) {
  const { device, attribute, datatype, dataformat, tangoDB, onClose } = props;

  const fullName = device + "/" + attribute;
  const [value, setValue] = useState(null);

  useEffect(() => {
    const emitter = TangoAPI.changeEventEmitter(tangoDB, [fullName]);
    return emitter((frame: any) => setValue(frame.value));
  }, [fullName, setValue, tangoDB]);

  const content =
    value == null ? (
      "Loading..."
    ) : datatype === "DevString" ? (
      <StringDisplay value={value as any} /> /* TODO */
    ) : dataformat === "IMAGE" ? (
      <ImageDisplay value={value as any} /> /* TODO */
    ) : (
      <SpectumDisplay value={value as any} datatype={datatype} /> /* TODO */
    );

  return (
    <Modal title={fullName}>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => onClose()}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

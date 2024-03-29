import { GLCanvas } from "dok-gl-canvas";
import { GlController } from "dok-gl-canvas/dist/control/gl-controller";
import React from "react";
import * as ReactDOMClient from "react-dom/client";


const vertex = `#version 300 es

precision highp float;
layout (location=0) in vec4 position;
layout (location=1) in vec2 gridPosition;

out vec2 vGridPosition;

void main() {
    gl_Position = position;
    vGridPosition = gridPosition;
}
`;

const programs = [
  {
      id: "sample-grid-cell-1",
      vertex,
      fragment:
      `#version 300 es

        precision highp float;
        out vec4 fragColor;
        in vec2 vGridPosition;

        void main() {
            float x = abs(fract(vGridPosition.x) - .5) * 2.;
            float y = abs(fract(vGridPosition.y) - .5) * 2.;
            float val = smoothstep(.95, 1., max(x, y));
            fragColor = vec4(0., 0., 1., val);
        }
      `
    },
  {
      id: "sample-grid-cell-.1",
      vertex,
      fragment:
      `#version 300 es

        precision highp float;
        out vec4 fragColor;
        in vec2 vGridPosition;

        void main() {
            float x = abs(fract(vGridPosition.x * 10.) - .5) * 2.;
            float y = abs(fract(vGridPosition.y * 10.) - .5) * 2.;
            float val = smoothstep(.8, .95, max(x, y)) / 2.;

            float x2 = abs(fract(vGridPosition.x) - .5) * 2.;
            float y2 = abs(fract(vGridPosition.y) - .5) * 2.;
            float val2 = smoothstep(.95, 1., max(x2, y2));

            fragColor = vec4(val, 0, val2, max(val, val2));
        }
      `
  },
];

interface Props {
  controller: GlController;
}

const App = ({ controller }: Props) => <GLCanvas
    controller={controller}
    programs={programs}
    actionScripts={[
      {
        name: "redraw",
        actions: [
          {
            action: "clear",
            color: true,
          },
          {
            action: "draw",
            vertexCount: 6,
          },    
        ],
      },
      {
        name: "animate",
        actions: [
          {
            action: "custom",
            location: "position",
            processAttributeBuffer(positions, time) {
              positions[0] = (Math.sin(time / 100)) / 2;
              positions[9] = (Math.sin(time / 100)) / 2;
              positions[15] = (2 + Math.sin(time / 100)) / 2;
              return undefined;       
            },
          },
          "redraw"
        ],
      },
    ]}
    actionPipeline={[
      {
        action: "bind-vertex",
      },
      {
        action: "buffer-attribute",
        location: "position",
        buffer: [
          -.5, .5, 0.0,
          -.5, -.5, 0.0,
          .5, -.5, 0.0,
          -.5, .5, 0.0,
          .5, -.5, 0.0,
          .5, .5, 0.0,
        ],
        size: 3,
      },
      {
        action: "buffer-attribute",
        location: "gridPosition",
        buffer: [
          0, 10,
          0, 0,
          10, 0,
          0, 10,
          10, 0,
          10, 10,
        ],
        size: 2,
      },
      "redraw"
    ]}
/>;


function hookupApp(root: HTMLDivElement, controller: GlController) {
  const hudRoot = ReactDOMClient.createRoot(root!);

  hudRoot.render(<App controller={controller} />)  
}



const exports = {
  hookupApp,
}

export default exports;

globalThis.exports = exports;

/* Any copyright is dedicated to the Public Domain.
 http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Test that increasing/decreasing values in rule view using
// arrow keys works correctly.

// Bug 1275446 - This test happen to hit the default timeout on linux32
requestLongerTimeout(2);

const TEST_URI = `
  <style>
    #test {
      margin-top: 0px;
      padding-top: 0px;
      color: #000000;
      background-color: #000000;
      background: none;
      transition: initial;
      z-index: 0;
      opacity: 1;
      line-height: 1;
      --custom: 0;
    }
  </style>
  <div id="test"></div>
`;

add_task(async function () {
  await addTab("data:text/html;charset=utf-8," + encodeURIComponent(TEST_URI));

  const { inspector, view } = await openRuleView();
  await selectNode("#test", inspector);

  await testMarginIncrements(view);
  await testVariousUnitIncrements(view);
  await testHexIncrements(view);
  await testAlphaHexIncrements(view);
  await testRgbIncrements(view);
  await testHslIncrements(view);
  await testRgbCss4Increments(view);
  await testHslCss4Increments(view);
  await testHwbIncrements(view);
  await testShorthandIncrements(view);
  await testOddCases(view);
  await testZeroValueIncrements(view);
  await testOpacityIncrements(view);
  await testLineHeightIncrements(view);
  await testCssVariableIncrements(view);
});

async function testMarginIncrements(view) {
  info("Testing keyboard increments on the margin property");

  const marginPropEditor = getTextProperty(view, 1, {
    "margin-top": "0px",
  }).editor;

  await runIncrementTest(marginPropEditor, view, {
    1: {
      ...getSmallIncrementKey(),
      start: "0px",
      end: "0.1px",
      selectAll: true,
    },
    2: { start: "0px", end: "1px", selectAll: true },
    3: { shift: true, start: "0px", end: "10px", selectAll: true },
    4: {
      down: true,
      ...getSmallIncrementKey(),
      start: "0.1px",
      end: "0px",
      selectAll: true,
    },
    5: { down: true, start: "0px", end: "-1px", selectAll: true },
    6: { down: true, shift: true, start: "0px", end: "-10px", selectAll: true },
    7: {
      pageUp: true,
      shift: true,
      start: "0px",
      end: "100px",
      selectAll: true,
    },
    8: {
      pageDown: true,
      shift: true,
      start: "0px",
      end: "-100px",
      selectAll: true,
    },
    9: { start: "0", end: "1px", selectAll: true },
    10: { down: true, start: "0", end: "-1px", selectAll: true },
  });
}

async function testVariousUnitIncrements(view) {
  info("Testing keyboard increments on values with various units");

  const paddingPropEditor = getTextProperty(view, 1, {
    "padding-top": "0px",
  }).editor;

  await runIncrementTest(paddingPropEditor, view, {
    1: { start: "0px", end: "1px", selectAll: true },
    2: { start: "0pt", end: "1pt", selectAll: true },
    3: { start: "0pc", end: "1pc", selectAll: true },
    4: { start: "0em", end: "1em", selectAll: true },
    5: { start: "0%", end: "1%", selectAll: true },
    6: { start: "0in", end: "1in", selectAll: true },
    7: { start: "0cm", end: "1cm", selectAll: true },
    8: { start: "0mm", end: "1mm", selectAll: true },
    9: { start: "0ex", end: "1ex", selectAll: true },
    10: { start: "0", end: "1px", selectAll: true },
    11: { down: true, start: "0", end: "-1px", selectAll: true },
  });
}

async function testHexIncrements(view) {
  info("Testing keyboard increments with hex colors");

  const hexColorPropEditor = getTextProperty(view, 1, {
    color: "#000000",
  }).editor;

  await runIncrementTest(hexColorPropEditor, view, {
    1: { start: "#CCCCCC", end: "#CDCDCD", selectAll: true },
    2: { shift: true, start: "#CCCCCC", end: "#DCDCDC", selectAll: true },
    3: { start: "#CCCCCC", end: "#CDCCCC", selection: [1, 3] },
    4: { shift: true, start: "#CCCCCC", end: "#DCCCCC", selection: [1, 3] },
    5: { start: "#FFFFFF", end: "#FFFFFF", selectAll: true },
    6: {
      down: true,
      shift: true,
      start: "#000000",
      end: "#000000",
      selectAll: true,
    },
  });
}

async function testAlphaHexIncrements(view) {
  info("Testing keyboard increments with alpha hex colors");

  const hexColorPropEditor = getTextProperty(view, 1, {
    color: "#000000",
  }).editor;

  await runIncrementTest(hexColorPropEditor, view, {
    1: { start: "#CCCCCCAA", end: "#CDCDCDAB", selectAll: true },
    2: { shift: true, start: "#CCCCCCAA", end: "#DCDCDCBA", selectAll: true },
    3: { start: "#CCCCCCAA", end: "#CDCCCCAA", selection: [1, 3] },
    4: { shift: true, start: "#CCCCCCAA", end: "#DCCCCCAA", selection: [1, 3] },
    5: { start: "#FFFFFFFF", end: "#FFFFFFFF", selectAll: true },
    6: {
      down: true,
      shift: true,
      start: "#00000000",
      end: "#00000000",
      selectAll: true,
    },
  });
}

async function testRgbIncrements(view) {
  info("Testing keyboard increments with rgb(a) colors");

  const rgbColorPropEditor = getTextProperty(view, 1, {
    "background-color": "#000000",
  }).editor;

  await runIncrementTest(rgbColorPropEditor, view, {
    1: { start: "rgb(0,0,0)", end: "rgb(0,1,0)", selection: [6, 7] },
    2: {
      shift: true,
      start: "rgb(0,0,0)",
      end: "rgb(0,10,0)",
      selection: [6, 7],
    },
    3: { start: "rgb(0,255,0)", end: "rgb(0,255,0)", selection: [6, 9] },
    4: {
      shift: true,
      start: "rgb(0,250,0)",
      end: "rgb(0,255,0)",
      selection: [6, 9],
    },
    5: {
      down: true,
      start: "rgb(0,0,0)",
      end: "rgb(0,0,0)",
      selection: [6, 7],
    },
    6: {
      down: true,
      shift: true,
      start: "rgb(0,5,0)",
      end: "rgb(0,0,0)",
      selection: [6, 7],
    },
    7: {
      start: "rgba(0,0,0,1)",
      end: "rgba(0,0,0,1)",
      selection: [11, 12],
    },
    8: {
      ...getSmallIncrementKey(),
      start: "rgba(0,0,0,0.5)",
      end: "rgba(0,0,0,0.6)",
      selection: [12, 13],
    },
    9: {
      down: true,
      start: "rgba(0,0,0,0)",
      end: "rgba(0,0,0,0)",
      selection: [11, 12],
    },
  });
}

async function testHslIncrements(view) {
  info("Testing keyboard increments with hsl(a) colors");

  const hslColorPropEditor = getTextProperty(view, 1, {
    "background-color": "#000000",
  }).editor;

  await runIncrementTest(hslColorPropEditor, view, {
    1: { start: "hsl(0,0%,0%)", end: "hsl(0,1%,0%)", selection: [6, 8] },
    2: {
      shift: true,
      start: "hsl(0,0%,0%)",
      end: "hsl(0,10%,0%)",
      selection: [6, 8],
    },
    3: { start: "hsl(0,100%,0%)", end: "hsl(0,100%,0%)", selection: [6, 10] },
    4: {
      shift: true,
      start: "hsl(0,95%,0%)",
      end: "hsl(0,100%,0%)",
      selection: [6, 10],
    },
    5: {
      down: true,
      start: "hsl(0,0%,0%)",
      end: "hsl(0,0%,0%)",
      selection: [6, 8],
    },
    6: {
      down: true,
      shift: true,
      start: "hsl(0,5%,0%)",
      end: "hsl(0,0%,0%)",
      selection: [6, 8],
    },
    7: {
      start: "hsla(0,0%,0%,1)",
      end: "hsla(0,0%,0%,1)",
      selection: [13, 14],
    },
    8: {
      ...getSmallIncrementKey(),
      start: "hsla(0,0%,0%,0.5)",
      end: "hsla(0,0%,0%,0.6)",
      selection: [14, 15],
    },
    9: {
      down: true,
      start: "hsla(0,0%,0%,0)",
      end: "hsla(0,0%,0%,0)",
      selection: [13, 14],
    },
  });
}

async function testRgbCss4Increments(view) {
  info("Testing keyboard increments with rgb colors using CSS 4 Color syntax");

  const rgbColorPropEditor = getTextProperty(view, 1, {
    "background-color": "#000000",
  }).editor;

  await runIncrementTest(rgbColorPropEditor, view, {
    1: { start: "rgb(0 0 0)", end: "rgb(0 1 0)", selection: [6, 7] },
    2: {
      shift: true,
      start: "rgb(0 0 0)",
      end: "rgb(0 10 0)",
      selection: [6, 7],
    },
    3: { start: "rgb(0 255 0)", end: "rgb(0 255 0)", selection: [6, 9] },
    4: {
      shift: true,
      start: "rgb(0 250 0)",
      end: "rgb(0 255 0)",
      selection: [6, 9],
    },
    5: {
      down: true,
      start: "rgb(0 0 0)",
      end: "rgb(0 0 0)",
      selection: [6, 7],
    },
    6: {
      down: true,
      shift: true,
      start: "rgb(0 5 0)",
      end: "rgb(0 0 0)",
      selection: [6, 7],
    },
    7: {
      start: "rgb(0 0 0/1)",
      end: "rgb(0 0 0/1)",
      selection: [10, 11],
    },
    8: {
      ...getSmallIncrementKey(),
      start: "rgb(0 0 0/0.5)",
      end: "rgb(0 0 0/0.6)",
      selection: [11, 12],
    },
    9: {
      down: true,
      start: "rgb(0 0 0/0)",
      end: "rgb(0 0 0/0)",
      selection: [10, 11],
    },
  });
}

async function testHslCss4Increments(view) {
  info("Testing keyboard increments with hsl colors using CSS 4 Color syntax");

  const hslColorPropEditor = getTextProperty(view, 1, {
    "background-color": "#000000",
  }).editor;

  await runIncrementTest(hslColorPropEditor, view, {
    1: { start: "hsl(0 0% 0%)", end: "hsl(0 1% 0%)", selection: [6, 8] },
    2: {
      shift: true,
      start: "hsl(0 0% 0%)",
      end: "hsl(0 10% 0%)",
      selection: [6, 8],
    },
    3: { start: "hsl(0 100% 0%)", end: "hsl(0 100% 0%)", selection: [6, 10] },
    4: {
      shift: true,
      start: "hsl(0 95% 0%)",
      end: "hsl(0 100% 0%)",
      selection: [6, 10],
    },
    5: {
      down: true,
      start: "hsl(0 0% 0%)",
      end: "hsl(0 0% 0%)",
      selection: [6, 8],
    },
    6: {
      down: true,
      shift: true,
      start: "hsl(0 5% 0%)",
      end: "hsl(0 0% 0%)",
      selection: [6, 8],
    },
    7: {
      start: "hsl(0 0% 0%/1)",
      end: "hsl(0 0% 0%/1)",
      selection: [12, 13],
    },
    8: {
      ...getSmallIncrementKey(),
      start: "hsl(0 0% 0%/0.5)",
      end: "hsl(0 0% 0%/0.6)",
      selection: [13, 14],
    },
    9: {
      down: true,
      start: "hsl(0 0% 0%/0)",
      end: "hsl(0 0% 0%/0)",
      selection: [12, 13],
    },
  });
}

async function testHwbIncrements(view) {
  info("Testing keyboard increments with hwb colors");

  const hwbColorPropEditor = getTextProperty(view, 1, {
    "background-color": "#000000",
  }).editor;

  await runIncrementTest(hwbColorPropEditor, view, {
    1: { start: "hwb(0 0% 0%)", end: "hwb(0 1% 0%)", selection: [6, 8] },
    2: {
      shift: true,
      start: "hwb(0 0% 0%)",
      end: "hwb(0 10% 0%)",
      selection: [6, 8],
    },
    3: { start: "hwb(0 100% 0%)", end: "hwb(0 100% 0%)", selection: [6, 10] },
    4: {
      shift: true,
      start: "hwb(0 95% 0%)",
      end: "hwb(0 100% 0%)",
      selection: [6, 10],
    },
    5: {
      down: true,
      start: "hwb(0 0% 0%)",
      end: "hwb(0 0% 0%)",
      selection: [6, 8],
    },
    6: {
      down: true,
      shift: true,
      start: "hwb(0 5% 0%)",
      end: "hwb(0 0% 0%)",
      selection: [6, 8],
    },
    7: {
      start: "hwb(0 0% 0%/1)",
      end: "hwb(0 0% 0%/1)",
      selection: [12, 13],
    },
    8: {
      ...getSmallIncrementKey(),
      start: "hwb(0 0% 0%/0.5)",
      end: "hwb(0 0% 0%/0.6)",
      selection: [13, 14],
    },
    9: {
      down: true,
      start: "hwb(0 0% 0%/0)",
      end: "hwb(0 0% 0%/0)",
      selection: [12, 13],
    },
  });
}

async function testShorthandIncrements(view) {
  info("Testing keyboard increments within shorthand values");

  const paddingPropEditor = getTextProperty(view, 1, {
    "padding-top": "0px",
  }).editor;

  await runIncrementTest(paddingPropEditor, view, {
    1: { start: "0px 0px 0px 0px", end: "0px 1px 0px 0px", selection: [4, 7] },
    2: {
      shift: true,
      start: "0px 0px 0px 0px",
      end: "0px 10px 0px 0px",
      selection: [4, 7],
    },
    3: { start: "0px 0px 0px 0px", end: "1px 0px 0px 0px", selectAll: true },
    4: {
      shift: true,
      start: "0px 0px 0px 0px",
      end: "10px 0px 0px 0px",
      selectAll: true,
    },
    5: {
      down: true,
      start: "0px 0px 0px 0px",
      end: "0px 0px -1px 0px",
      selection: [8, 11],
    },
    6: {
      down: true,
      shift: true,
      start: "0px 0px 0px 0px",
      end: "-10px 0px 0px 0px",
      selectAll: true,
    },
    7: {
      up: true,
      start: "0.1em .1em 0em 0em",
      end: "0.1em 1.1em 0em 0em",
      selection: [6, 9],
    },
    8: {
      up: true,
      ...getSmallIncrementKey(),
      start: "0.1em .9em 0em 0em",
      end: "0.1em 1em 0em 0em",
      selection: [6, 9],
    },
    9: {
      up: true,
      shift: true,
      start: "0.2em .2em 0em 0em",
      end: "0.2em 10.2em 0em 0em",
      selection: [6, 9],
    },
  });
}

async function testOddCases(view) {
  info("Testing some more odd cases");

  const marginPropEditor = getTextProperty(view, 1, {
    "margin-top": "0px",
  }).editor;

  await runIncrementTest(marginPropEditor, view, {
    1: { start: "98.7%", end: "99.7%", selection: [3, 3] },
    2: {
      ...getSmallIncrementKey(),
      start: "98.7%",
      end: "98.8%",
      selection: [3, 3],
    },
    3: { start: "0", end: "1px" },
    4: { down: true, start: "0", end: "-1px" },
    5: { start: "'a=-1'", end: "'a=0'", selection: [4, 4] },
    6: { start: "0 -1px", end: "0 0px", selection: [2, 2] },
    7: { start: "url(-1)", end: "url(-1)", selection: [4, 4] },
    8: {
      start: "url('test1.1.png')",
      end: "url('test1.2.png')",
      selection: [11, 11],
    },
    9: {
      start: "url('test1.png')",
      end: "url('test2.png')",
      selection: [9, 9],
    },
    10: {
      shift: true,
      start: "url('test1.1.png')",
      end: "url('test11.1.png')",
      selection: [9, 9],
    },
    11: {
      down: true,
      start: "url('test-1.png')",
      end: "url('test-2.png')",
      selection: [9, 11],
    },
    12: {
      start: "url('test1.1.png')",
      end: "url('test1.2.png')",
      selection: [11, 12],
    },
    13: {
      down: true,
      ...getSmallIncrementKey(),
      start: "url('test-0.png')",
      end: "url('test--0.1.png')",
      selection: [10, 11],
    },
    14: {
      ...getSmallIncrementKey(),
      start: "url('test--0.1.png')",
      end: "url('test-0.png')",
      selection: [10, 14],
    },
  });
}

async function testZeroValueIncrements(view) {
  info("Testing a valid unit is added when incrementing from 0");

  const backgroundPropEditor = getTextProperty(view, 1, {
    background: "none",
  }).editor;
  await runIncrementTest(backgroundPropEditor, view, {
    1: {
      start: "url(test-0.png) no-repeat 0 0",
      end: "url(test-0.png) no-repeat 1px 0",
      selection: [26, 26],
    },
    2: {
      start: "url(test-0.png) no-repeat 0 0",
      end: "url(test-0.png) no-repeat 0 1px",
      selection: [28, 28],
    },
    3: {
      start: "url(test-0.png) no-repeat center/0",
      end: "url(test-0.png) no-repeat center/1px",
      selection: [34, 34],
    },
    4: {
      start: "url(test-0.png) no-repeat 0 0",
      end: "url(test-1.png) no-repeat 0 0",
      selection: [10, 10],
    },
    5: {
      start: "linear-gradient(0, red 0, blue 0)",
      end: "linear-gradient(1deg, red 0, blue 0)",
      selection: [17, 17],
    },
    6: {
      start: "linear-gradient(1deg, red 0, blue 0)",
      end: "linear-gradient(1deg, red 1px, blue 0)",
      selection: [27, 27],
    },
    7: {
      start: "linear-gradient(1deg, red 0, blue 0)",
      end: "linear-gradient(1deg, red 0, blue 1px)",
      selection: [35, 35],
    },
  });

  const transitionPropEditor = getTextProperty(view, 1, {
    transition: "initial",
  }).editor;
  await runIncrementTest(transitionPropEditor, view, {
    1: { start: "all 0 ease-out", end: "all 1s ease-out", selection: [5, 5] },
    2: {
      start: "margin 4s, color 0",
      end: "margin 4s, color 1s",
      selection: [18, 18],
    },
  });

  const zIndexPropEditor = getTextProperty(view, 1, { "z-index": "0" }).editor;
  await runIncrementTest(zIndexPropEditor, view, {
    1: { start: "0", end: "1", selection: [1, 1] },
  });
}

async function testOpacityIncrements(view) {
  info("Testing keyboard increments on the opacity property");

  const opacityPropEditor = getTextProperty(view, 1, { opacity: "1" }).editor;

  await runIncrementTest(opacityPropEditor, view, {
    1: {
      ...getSmallIncrementKey(),
      start: "0.5",
      end: "0.51",
      selectAll: true,
    },
    2: { start: "0", end: "0.1", selectAll: true },
    3: { shift: true, start: "0", end: "1", selectAll: true },
    4: {
      down: true,
      ...getSmallIncrementKey(),
      start: "0.1",
      end: "0.09",
      selectAll: true,
    },
    5: { down: true, start: "0", end: "-0.1", selectAll: true },
    6: { down: true, shift: true, start: "0", end: "-1", selectAll: true },
    7: { pageUp: true, shift: true, start: "0", end: "10", selectAll: true },
    8: { pageDown: true, shift: true, start: "0", end: "-10", selectAll: true },
    9: { start: "0.7", end: "0.8", selectAll: true },
    10: { down: true, start: "0", end: "-0.1", selectAll: true },
  });
}

async function testLineHeightIncrements(view) {
  info("Testing keyboard increments on the line height property");

  const opacityPropEditor = getTextProperty(view, 1, {
    "line-height": "1",
  }).editor;

  // line-height accepts both values with or without units, check that we don't
  // force using a unit if none was specified.
  await runIncrementTest(opacityPropEditor, view, {
    1: {
      ...getSmallIncrementKey(),
      start: "0",
      end: "0.1",
      selectAll: true,
    },
    2: {
      ...getSmallIncrementKey(),
      start: "0px",
      end: "0.1px",
      selectAll: true,
    },
    3: {
      start: "0",
      end: "1",
      selectAll: true,
    },
    4: {
      start: "0px",
      end: "1px",
      selectAll: true,
    },
    5: {
      down: true,
      ...getSmallIncrementKey(),
      start: "0",
      end: "-0.1",
      selectAll: true,
    },
    6: {
      down: true,
      ...getSmallIncrementKey(),
      start: "0px",
      end: "-0.1px",
      selectAll: true,
    },
    7: {
      down: true,
      start: "0",
      end: "-1",
      selectAll: true,
    },
    8: {
      down: true,
      start: "0px",
      end: "-1px",
      selectAll: true,
    },
  });
}

async function testCssVariableIncrements(view) {
  info("Testing keyboard increments on the css variable property");

  const opacityPropEditor = getTextProperty(view, 1, {
    "--custom": "0",
  }).editor;

  await runIncrementTest(opacityPropEditor, view, {
    1: {
      ...getSmallIncrementKey(),
      start: "0",
      end: "0.1",
      selectAll: true,
    },
    2: {
      start: "0",
      end: "1",
      selectAll: true,
    },
    3: {
      down: true,
      ...getSmallIncrementKey(),
      start: "0",
      end: "-0.1",
      selectAll: true,
    },
    4: {
      down: true,
      start: "0",
      end: "-1",
      selectAll: true,
    },
  });
}

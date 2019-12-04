import {CSStoHSL, RGBtoCSS, CSStoRGB, brighten, saturate, shiftHue} from "./colorUtils";

it("correctly parses css strings to HSL", () => {
  expect(CSStoHSL("#ffffff")).toEqual([0,0,100])
  expect(CSStoHSL("#fff")).toEqual([0,0,100])
  expect(CSStoHSL("rgb(255,255,255)")).toEqual([0,0,100])
  expect(CSStoHSL("rgba(255,255,255, 1)")).toEqual([0,0,100])
  expect(CSStoHSL("white")).toEqual([0,0,100])
});

it("correctly parses css strings to HSL, and back to css", () => {
  expect(RGBtoCSS(CSStoRGB("#ffffff"))).toEqual("#ffffff")
  expect(RGBtoCSS(CSStoRGB("#fff"))).toEqual("#ffffff")
  expect(RGBtoCSS(CSStoRGB("rgb(255,255,255)"))).toEqual("#ffffff")
  expect(RGBtoCSS(CSStoRGB("rgba(255,255,255, 1)"))).toEqual("#ffffff")
  expect(RGBtoCSS(CSStoRGB("white"))).toEqual("#ffffff")
});

it("can brighten colors", () => {
  expect(brighten("#000", 0)).toEqual("#000000")
  expect(brighten("#000", 25)).toEqual("#404040")
  expect(brighten("#000", 50)).toEqual("#808080")
  expect(brighten("#000", 75)).toEqual("#bfbfbf")
  expect(brighten("#000", 100)).toEqual("#ffffff")

  expect(brighten("#fff", -0)).toEqual("#ffffff")
  expect(brighten("#fff", -25)).toEqual("#bfbfbf")
  expect(brighten("#fff", -50)).toEqual("#808080")
  expect(brighten("#fff", -75)).toEqual("#404040")
  expect(brighten("#fff", -100)).toEqual("#000000")

  expect(brighten("#a95cb6", -50)).toEqual("#0d060e")
  expect(brighten("#a95cb6", -25)).toEqual("#5e2e66")
  expect(brighten("#a95cb6", 0)).toEqual("#a95db6") //rounding error, green channel is off by 1!
  expect(brighten("#a95cb6", 25)).toEqual("#d8b5de")
  expect(brighten("#a95cb6", 50)).toEqual("#ffffff")

});

it("can desaturate", () => {
  expect(saturate("#6ebad0", 0)).toEqual("#6dbad0")
  expect(saturate("#6ebad0", 10)).toEqual("#63c0d9")
  expect(saturate("#6ebad0", 30)).toEqual("#50cbed")
  expect(saturate("#6ebad0", 50)).toEqual("#3dd5ff")
  expect(saturate("#6ebad0", -10)).toEqual("#76b5c6")
  expect(saturate("#6ebad0", -30)).toEqual("#8aaab2")
  expect(saturate("#6ebad0", -50)).toEqual("#9d9f9f")

});

it("can shift hue", () => {
  expect(shiftHue("#6ebad0", -160)).toEqual("#d0a36d")
  expect(shiftHue("#6ebad0", -120)).toEqual("#bad06d")
  expect(shiftHue("#6ebad0", -80)).toEqual("#78d06d")
  expect(shiftHue("#6ebad0", -40)).toEqual("#6dd0a3")
  expect(shiftHue("#6ebad0", 0)).toEqual("#6dbad0")
  expect(shiftHue("#6ebad0", 40)).toEqual("#6d78d0")
  expect(shiftHue("#6ebad0", 80)).toEqual("#a36dd0")
  expect(shiftHue("#6ebad0", 120)).toEqual("#d06dba")
  expect(shiftHue("#6ebad0", 160)).toEqual("#d06d78")




});
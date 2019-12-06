import {brighten, saturate, rotate} from "./colorUtils";

it("can brighten/darken colors", () => {
    expect(brighten("#888", 0)).toEqual("#888888")
    expect(brighten("#888", 25)).toEqual("#C8C8C8")
    expect(brighten("#888", 50)).toEqual("#FFFFFF")
    expect(brighten("#888", -25)).toEqual("#484848")
    expect(brighten("#888", -50)).toEqual("#090909")
  
  });

  it("can saturate/desaturate colors", () => {
    expect(saturate("#a55187", 0)).toEqual("#A55187")
    expect(saturate("#a55187", 25)).toEqual("#C43290")
    expect(saturate("#a55187", 50)).toEqual("#E31399")
    expect(saturate("#a55187", -25)).toEqual("#86707E")
    expect(saturate("#a55187", -50)).toEqual("#7B7B7B")
  
  });

  it("can rotate colors", () => {
    expect(rotate("#848eff", -160)).toEqual("#E0FF84")
    expect(rotate("#848eff", -120)).toEqual("#8EFF84")
    expect(rotate("#848eff", -80)).toEqual("#84FFCC")
    expect(rotate("#848eff", -40)).toEqual("#84E0FF")
    expect(rotate("#848eff", 0)).toEqual("#848EFF")
    expect(rotate("#848eff", 40)).toEqual("#CC84FF")
    expect(rotate("#848eff", 80)).toEqual("#FF84E0")
    expect(rotate("#848eff", 120)).toEqual("#FF848E")
    expect(rotate("#848eff", 160)).toEqual("#FFCC84")

    expect(rotate("#848eff", 720)).toEqual("#848EFF")
  
  });
  
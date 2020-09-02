import { Key, MouseButton } from ".";

describe("button registry", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should register keyboard key down", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const keyboardKey = Key.SHIFT;
    const expectedRegisteredKeys = {
      keyboard: [keyboardKey],
      mouse: [],
    };

    //WHEN
    ButtonRegistry.registerKeyboardPressKeys(keyboardKey);

    //THEN
    expect(ButtonRegistry.getActiveKeys()).toEqual(expectedRegisteredKeys);
  });

  it("should register keyboard key up", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const expectedRegisteredKeys = {
      keyboard: [Key.SHIFT],
      mouse: [],
    };
    ButtonRegistry.registerKeyboardPressKeys(Key.CTRL, Key.SHIFT);

    //WHEN
    ButtonRegistry.registerKeyboardReleaseKeys(Key.CTRL);

    //THEN
    expect(ButtonRegistry.getActiveKeys()).toEqual(expectedRegisteredKeys);
  });

  it("should register mouse down", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const mousedown = MouseButton.LEFT;
    const expectedRegisteredKeys = {
      keyboard: [],
      mouse: [mousedown],
    };

    //WHEN
    ButtonRegistry.registerMouseDown(mousedown);

    //THEN
    expect(ButtonRegistry.getActiveKeys()).toEqual(expectedRegisteredKeys);
  });

  it("should register mouse up", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const expectedRegisteredKeys = {
      keyboard: [],
      mouse: [MouseButton.MIDDLE],
    };
    ButtonRegistry.registerMouseDown(MouseButton.LEFT);
    ButtonRegistry.registerMouseDown(MouseButton.MIDDLE);

    //WHEN
    ButtonRegistry.registerMouseUp(MouseButton.LEFT);

    //THEN
    expect(ButtonRegistry.getActiveKeys()).toEqual(expectedRegisteredKeys);
  });

  it("should return active keys", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const mousedown = MouseButton.RIGHT;
    const keyboardKey = Key.CTRL;
    const expectedRegisteredKeys = {
      keyboard: [keyboardKey],
      mouse: [mousedown],
    };
    ButtonRegistry.registerMouseDown(mousedown);
    ButtonRegistry.registerKeyboardPressKeys(keyboardKey);

    //WHEN
    const registeredKeys = ButtonRegistry.getActiveKeys();

    //THEN
    expect(registeredKeys).toEqual(expectedRegisteredKeys);
  });
});

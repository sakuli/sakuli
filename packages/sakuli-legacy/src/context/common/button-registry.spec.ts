import { Key, MouseButton } from ".";

describe("button registry", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should register keyboard keydown", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const keyboardKey = Key.SHIFT;
    const expectedRegisteredKeys = {
      keyboard: [keyboardKey],
      mouse: [],
    };

    //WHEN
    ButtonRegistry.registerKeyboardKeyDown(keyboardKey);

    //THEN
    expect(ButtonRegistry.getRegisteredKeys()).toEqual(expectedRegisteredKeys);
  });

  it("should register keyboard keyup", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const expectedRegisteredKeys = {
      keyboard: [Key.SHIFT],
      mouse: [],
    };
    ButtonRegistry.registerKeyboardKeyDown(Key.CTRL, Key.SHIFT);

    //WHEN
    ButtonRegistry.registerKeyboardKeyUp(Key.CTRL);

    //THEN
    expect(ButtonRegistry.getRegisteredKeys()).toEqual(expectedRegisteredKeys);
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
    expect(ButtonRegistry.getRegisteredKeys()).toEqual(expectedRegisteredKeys);
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
    expect(ButtonRegistry.getRegisteredKeys()).toEqual(expectedRegisteredKeys);
  });

  it("should return registeredKeys", () => {
    //GIVEN
    const ButtonRegistry = require("./button-registry");
    const mousedown = MouseButton.RIGHT;
    const keyboardKey = Key.CTRL;
    const expectedRegisteredKeys = {
      keyboard: [keyboardKey],
      mouse: [mousedown],
    };
    ButtonRegistry.registerMouseDown(mousedown);
    ButtonRegistry.registerKeyboardKeyDown(keyboardKey);

    //WHEN
    const registeredKeys = ButtonRegistry.getRegisteredKeys();

    //THEN
    expect(registeredKeys).toEqual(expectedRegisteredKeys);
  });
});

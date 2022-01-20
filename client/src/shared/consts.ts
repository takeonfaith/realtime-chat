interface IColors {
  [key: string]: IColorPalette;
}

export interface IColorPalette {
  main: string;
  transparent: string;
  lighter: string;
  darker: string;
  light: string;
  dark: string;
  darkTransparent: string;
}

export const Colors: IColors = {
  green: {
    main: "#3cd288",
    transparent: "rgba(64, 197, 197, .3)",
    lighter: "#3cd2d2",
    darker: "#258787",
    light: "",
    dark: "#2a4f2f",
    darkTransparent: "#166c217a",
  },
  lightGreen: {
    main: "rgb(64, 197, 197)",
    transparent: "rgba(64, 197, 197, .3)",
    lighter: "#3cd2d2",
    darker: "#258787",
    light: "",
    dark: "#216666",
    darkTransparent: "",
  },
  blue: {
    main: "rgb(95, 109, 236)",
    transparent: "rgba(95, 109, 236, .3)",
    lighter: "#7884ec",
    darker: "#414ca8",
    light: "",
    dark: "#3f457f",
    darkTransparent: "",
  },
  darkBlue: {
    main: "#9cbbff",
    transparent: "rgba(95, 109, 236, .3)",
    lighter: "#7884ec",
    darker: "#414ca8",
    light: "",
    dark: "#4c73ca",
    darkTransparent: "",
  },
  purple: {
    main: "rgb(168, 95, 236)",
    transparent: "rgba(168, 95, 236, .3)",
    lighter: "#d079ec",
    darker: "#824eb2",
    light: "",
    dark: "#7e3798",
    darkTransparent: "",
  },
  pink: {
    main: "rgb(236, 95, 182)",
    transparent: "rgba(236, 95, 182, .3)",
    lighter: "#e06cb4",
    darker: "#b24788",
    light: "",
    dark: "#842b62",
    darkTransparent: "",
  },
  red: {
    main: "rgb(236, 95, 107)",
    transparent: "rgba(236, 95, 107, .2)",
    lighter: "#f67b86",
    darker: "#b63c46",
    light: "",
    dark: "#632d32",
    darkTransparent: "#511a1ea3",
  },
  yellow: {
    main: "#ee9e44",
    transparent: "rgba(236, 95, 107, .3)",
    lighter: "#f67b86",
    darker: "#b63c46",
    light: "",
    dark: "#632d32",
    darkTransparent: "#511a1ea3",
  },
};

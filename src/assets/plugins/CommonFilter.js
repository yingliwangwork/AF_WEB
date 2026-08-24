import dayjs from "dayjs";

export default {
  install(app) {
    app.provide("bindPath", (value) => {
      if (!value) {
        return "";
      }

      const VITE_API_HOST = import.meta.env.VITE_API_HOST;
      const root_path = VITE_API_HOST.endsWith("/")
        ? VITE_API_HOST
        : VITE_API_HOST + "/";

      const value_path = value.startsWith("/") ? value : "/" + value;
      return root_path + "Path" + value_path;
    });

    app.provide("bindPublicPath", (value) => {
      // bind public assets folder path.
      if (!value) {
        return "";
      }
      return import.meta.env.BASE_URL + value;
    });

    app.provide("dateFormat", (value, format) => {
      // dateFormat
      if (!value) {
        return "";
      }

      const _format = format || "YYYY-MM-DD HH:mm:ss";
      return dayjs(value).format(_format);
    });

    app.provide("jsonTools", {
      parse: (value) => {
        if (!value) {
          return null;
        }
        return JSON.parse(value);
      },
      stringify: (value) => {
        if (!value) {
          return "";
        }
        return JSON.stringify(value);
      },
    });
  },
};

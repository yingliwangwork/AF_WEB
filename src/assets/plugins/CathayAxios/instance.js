/**
 * [20240612]
 * 針對專案需要將API集中到service/api/index.js管理的需求，將axios的request進行單獨封裝
 * 與vue實例流程拆開，讓axios可以在api檔案中直接調用，並且可以進行loading與錯誤訊息的顯示
 * 在CathayAxios/index.js中也有install到vue，使用CathayAxios與api中獨立引用cathayAxios效果不會有區別
 * 此區域無法使用pinia及vue的相關全域函數或方法(可視為單獨JS檔案)
 */

import axios from "axios";
import notify from "@/assets/plugins/CathayNotification/notify.js";
import defaultLoader from "@/assets/plugins/CathayLoader/defaultLoader.js";

let needLoadingRequestCount = 0;
const showLoaderMask = true;

const $notifySuccessMethod = notify.success;
const $notifyErrorMethod = notify.error;

const $loadMaskOpen = defaultLoader.open;
const $loadMaskClose = defaultLoader.close;

const customHeaders = {
  get: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded;charset=big5",
    "X-Requested-With": "XMLHttpRequest",
    Pragma: "no-cache",
    "Cache-Control": "no-cache, no-store",
  },
  post: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded;charset=big5",
    "X-Requested-With": "XMLHttpRequest",
  },
  put: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded;charset=big5",
    "X-Requested-With": "XMLHttpRequest",
  },
  delete: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded;charset=big5",
    "X-Requested-With": "XMLHttpRequest",
  },
};

/**
 * 建立初始的axios物件。
 *
 * 如果沒有賦予config，則會填充預設的baseURL、Headers
 * @param {object} config axios的confgi , 最基本有baseURL、Headers
 * @param {string} config.baseURL axios的confgi
 * @param {boolean} config.withCredentials axios的confgi
 * @param {object} config.headers axios的config
 * @returns {*} 吐回axios.create
 */
const createCathayDefault = (config) => {
  if (config) {
    return axios.create(config);
  }

  return axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    // withCredentials: true,
    // headers: customHeaders,
  });
};

const cathayAxios = createCathayDefault();

const showRtnMessage = true;
/**
 * axios 封包回傳攔截器
 */
cathayAxios.interceptors.response.use(
  (response) => {
    tryHideFullScreenLoading();
    if (response.data.code === 200) {
      $notifySuccessMethod(response.data.msg || "伺服器維護中，請稍候再試!");
      response.data.returnCode = 0;
    } else {
      $notifyErrorMethod(response.data.msg || "伺服器維護中，請稍候再試!");
      response.data.returnCode = 999;
    }

    return response.data;
  },
  (error) => {
    tryHideFullScreenLoading();
    if (showRtnMessage) {
      $notifyErrorMethod("伺服器維護中，請稍候再試!", error);
    }
    return Promise.resolve({
      jsonData: {
        code: "999",
        error: true,
        msg: "伺服器維護中，請稍候再試!",
      },
    });
  },
);

cathayAxios.interceptors.request.use((config) => {
  if (["development", "testing"].indexOf(import.meta.env.VITE_NODE_ENV) > -1) {
    /* eslint-disable no-console */
    /* 這裡已有判斷僅在開發、測試環境會顯示console */
    console.log("[CathayAxios] Request Url: " + config.url);
    /* eslint-enable no-console */
    if (import.meta.env.VITE_API_MODE === "static") {
      config.url = "static/data/" + config.url.split("?")[0] + ".json";
    }
  }

  showFullScreenLoading();
  return config;
});

/**
 * download
 * @param {*} data data
 * @param {*} fileName fileName
 */
function download(data, fileName) {
  if (!data) {
    return;
  }
  const blob = new Blob([data], {
    type: "application/octet-stream",
  });

  if (window.navigator.msSaveOrOpenBlob) {
    // FOR IE
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // 釋放資源
  }
}

/**
 * 透過遮罩顯示Loading
 */
function showFullScreenLoading() {
  if (!showLoaderMask || !$loadMaskOpen) return;
  if (needLoadingRequestCount === 0) {
    $loadMaskOpen();
  }
  needLoadingRequestCount += 1;
}

/**
 * tryHideFullScreenLoading
 */
function tryHideFullScreenLoading() {
  if (!showLoaderMask || !$loadMaskClose) return;
  if (needLoadingRequestCount <= 0) return;

  needLoadingRequestCount -= 1;
  if (needLoadingRequestCount === 0) {
    $loadMaskClose();
  }
}

const reader = new FileReader();
/**
 * create FileReader
 * @param {*} blob blob
 * @param {*} callBack callBack
 */
function transBlobToObject(blob, callBack) {
  reader.onload = function () {
    callBack(JSON.parse(this.result));
  };
  reader.readAsText(blob);
}

export default {
  get: (url, param) => {
    return cathayAxios.get(url, { params: param });
  },
  post: (url, body) => {
    return cathayAxios.post(url, body);
  },
  put: (url, body) => {
    return cathayAxios.put(url, body);
  },
  delete: (url, body) => {
    return cathayAxios.delete(url, { data: body });
  },
  upload: (url, body) => {
    let _url = url;
    if (import.meta.env.VITE_API_HOST != "/") {
      _url = import.meta.env.VITE_API_HOST + "/" + url;
    }
    showFullScreenLoading();
    return axios
      .post(_url, body, {
        headers: {
          "Content-Type": " multipart/form-data;",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      })
      .then((response) => {
        tryHideFullScreenLoading();
        if (response.data && response.data.ErrMsg.returnCode == 0) {
          if (
            response.data.msg &&
            response.data.msg.length > 0 &&
            showRtnMessage
          ) {
            $notifySuccessMethod(response.data.msg);
          }
          return Promise.resolve(response.data);
        }

        if (showRtnMessage) {
          $notifyErrorMethod(response.data.msg);
        }
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        tryHideFullScreenLoading();
        if (showRtnMessage) {
          $notifyErrorMethod("上傳檔案至伺服器發生錯誤!", error);
        }
        return Promise.resolve(error);
      });
  },
  download: (url, body, name) => {
    let _url = url;
    if (import.meta.env.VITE_API_HOST != "/") {
      _url = import.meta.env.VITE_API_HOST + "/" + url;
    }
    showFullScreenLoading();
    return new Promise((resolve, reject) => {
      axios
        .post(_url, body, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
          },
          transformRequest: [
            function (data) {
              let ret = "";
              Object.keys(data).forEach((key) => {
                ret +=
                  encodeURIComponent(key) +
                  "=" +
                  encodeURIComponent(data[key]) +
                  "&";
              });
              return ret;
            },
          ],
          withCredentials: true,
          responseType: "blob",
        })
        .then((resp) => {
          tryHideFullScreenLoading();
          if (!resp.data || resp.data.type != "application/octet-stream") {
            // data convert to javascript object
            transBlobToObject(resp.data, function (data) {
              $notifyErrorMethod("下載失敗! " + data.msg);
              resolve(data);
            });
          } else {
            resolve(download(resp.data, name));
          }
        })
        .catch((err) => {
          tryHideFullScreenLoading();
          reject(err.data);
        });
    });
  },
  create: (config) => {
    return createCathayDefault(config);
  },
};

export default () => {
  const installHL = (WebRootPath) => {
    if (!window.imeServer) {
      window.imeServer = "https://mi.cathaylife.com.tw/wf/";
    }

    if (!window.WebRootPath) {
      window.WebRootPath = WebRootPath;
    }

    if (!isScriptAppended()) {
      const jscript = document.createElement("script");
      jscript.setAttribute("lang", "text/javascript");
      jscript.setAttribute("src", `${WebRootPath}hanlinks/wf_links.js`);
      document.getElementsByTagName("head").item(0).appendChild(jscript);
    }
  };
  const isScriptAppended = () => {
    const scripts = document.getElementsByTagName("script");
    return [...scripts]
      .map((x) => x.src)
      .some((x) => x.includes("hanlinks/wf_links.js"));
  };
  const createHLInput = (ele) => {
    const addHanlinks = setInterval(() => {
      if (typeof AlertieIME === "undefined") {
        return;
      }
      //const imeData = new AlertieIME(ele);
      //addHlSelect(imeData.imeCandidates);
      //addHlKeyPress(imeData.imeInput);
      new AlertieIME(ele);
      ele.setAttribute("vue", "true");
      window.clearInterval(addHanlinks);
    }, 100);
  };
  const addHlSelect = (ele) => {
    ele.addEventListener("click", function (e) {
      const targetId = e.target.id;
      if (targetId.startsWith("ContainerID") || targetId.startsWith("wf")) {
        Alertie.curInput.imeTextArea.value +=
          e.target.parentElement.childNodes[1].textContent;
        const event = new Event("input", { bubbles: true });
        Alertie.curInput.imeTextArea.dispatchEvent(event);
      }
    });
  };
  const addHlKeyPress = (ele) => {
    ele.addEventListener("keypress", function (e) {
      let tmpKeyCode = e.keyCode;
      const imeCandidates = this.parentElement.childNodes[1];
      if (
        tmpKeyCode > 48 &&
        tmpKeyCode < 58 &&
        imeCandidates.childElementCount > 0
      ) {
        // console.log("keycode : " + tmpKeyCode);
        tmpKeyCode -= 49;
        // console.log("number of : " + tmpKeyCode);
        if (document.querySelectorAll("#ContainerID").length < tmpKeyCode + 1) {
          return;
        }
        const context =
          document.querySelectorAll("#ContainerID")[tmpKeyCode].textContent;
        Alertie.curInput.imeTextArea.value += context;
        const event = new Event("input", { bubbles: true });
        Alertie.curInput.imeTextArea.dispatchEvent(event);
      }
    });
  };
  return { installHL, createHLInput, addHlSelect, addHlKeyPress };
};

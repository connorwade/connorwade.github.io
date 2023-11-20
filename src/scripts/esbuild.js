import * as esbuild from "../../node_modules/esbuild-wasm/esm/browser.min.js";
import wasmURl from "../../node_modules/esbuild-wasm/esbuild.wasm?url";

/**
 * @type {HTMLTextAreaElement}
 */
const jsTextArea = document.querySelector("#script");
const minifyBtn = document.querySelector(".btn-primary");
const outputTextArea = document.querySelector("#output");
const loaderSelect = document.querySelector("#opt-loader");
const bannerInput = document.querySelector("#opt-banner");
const footerInput = document.querySelector("#opt-footer");
const formatSelect = document.querySelector("#opt-format");

await esbuild.initialize({
  wasmURL: wasmURl,
  worker: true,
});

minifyBtn.addEventListener("click", async (e) => {
  const rawJs = jsTextArea.value;
  let banner = "";
  let footer = "";

  if (bannerInput.value.length > 0) {
    banner =
      loaderSelect.value === "css"
        ? `/*${bannerInput.value}*/`
        : `//${bannerInput.value}`;
    footer =
      loaderSelect.value === "css"
        ? `/*${footerInput.value}*/`
        : `//${footerInput.value}`;
  }

  try {
    let result = await esbuild.transform(rawJs, {
      loader: loaderSelect.value,
      banner: banner,
      footer: footer,
      format: formatSelect.value,
      minify: true,
    });
    outputTextArea.value = result.code;
  } catch (e) {
    outputTextArea.value = e;
  }
});

import Navigo from "navigo";
import "./style.css";
import HomePage from "./src/pages/HomePage";

document.addEventListener("DOMContentLoaded", () => {
  const router = new Navigo("/", {
    linksSelector: "a",
  });
  const app = document.getElementById("app");

  const render = (position, content) => {
    position.innerHTML = content();
  };
  router.on("/", () => render(app, HomePage));
  router.resolve();
});

let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.querySelector(".theme-switch");

const computerIsDark = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches;

if (darkmode === "active" || (!darkmode && computerIsDark)) {
  document.body.classList.add("darkmode");
}

const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
};

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");
  darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});

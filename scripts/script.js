const themeSwitch = document.querySelector(".theme-switch");

const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
};

themeSwitch.addEventListener("click", () => {
  document.body.classList.contains("darkmode")
    ? disableDarkmode()
    : enableDarkmode();
});

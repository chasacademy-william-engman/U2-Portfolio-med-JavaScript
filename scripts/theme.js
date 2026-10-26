const savedTheme = localStorage.getItem("darkmode");
const computerDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "active" || (!savedTheme && computerDark)) {
  document.documentElement.classList.add("darkmode");
}

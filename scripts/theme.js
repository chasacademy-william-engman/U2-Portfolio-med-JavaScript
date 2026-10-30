const savedTheme = localStorage.getItem("darkmode");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "active" || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add("darkmode");
}

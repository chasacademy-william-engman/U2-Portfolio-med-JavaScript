const themeSwitch = document.querySelector(".theme-switch");
const filterSelect = document.getElementById("filter");

const enableDarkmode = () => {
  document.documentElement.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disableDarkmode = () => {
  document.documentElement.classList.remove("darkmode");
  localStorage.setItem("darkmode", "inactive");
};

themeSwitch.addEventListener("click", () => {
  document.documentElement.classList.contains("darkmode")
    ? disableDarkmode()
    : enableDarkmode();
});

const filterProjects = (technology) => {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    const techText =
      card.querySelector(".tech-stack")?.textContent.toLowerCase() ?? "";
    const match = technology === "all" || techText.includes(technology);
    card.style.display = match ? "" : "none";
  });
};

filterSelect?.addEventListener("change", () =>
  filterProjects(filterSelect.value),
);

const themeSwitch = document.querySelector(".theme-switch");
const filterSelect = document.getElementById("filter");
const cards = document.querySelectorAll(".project-card");

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

const filterProjects = (selectedOption) => {
  const selectedText = selectedOption.text.toLowerCase();
  console.log(selectedText);
  cards.forEach((card) => {
    const techElement = card.querySelector(".tech-stack");
    const cardTechText = techElement
      ? techElement.textContent.toLowerCase()
      : "";

    if (selectedText === "all" || cardTechText.includes(selectedText)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
};

filterSelect.addEventListener("change", (event) => {
  const selectedIndex = filterSelect.selectedIndex;
  const selectedOption = filterSelect.options[selectedIndex];
  filterProjects(selectedOption);
});

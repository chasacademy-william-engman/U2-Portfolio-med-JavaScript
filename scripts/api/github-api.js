const linkIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="link-svg icon-invert"><path d="M11.2867 8.71306C10.6041 8.03075 9.67846 7.64746 8.71334 7.64746C7.74821 7.64746 6.82259 8.03075 6.14 8.71306L3.56584 11.2864C2.88324 11.969 2.49976 12.8948 2.49976 13.8601C2.49976 14.8255 2.88324 15.7513 3.56584 16.4339C4.24844 17.1165 5.17424 17.5 6.13959 17.5C7.10493 17.5 8.03074 17.1165 8.71334 16.4339L10 15.1472" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.71332 11.2864C9.39591 11.9687 10.3215 12.352 11.2867 12.352C12.2518 12.352 13.1774 11.9687 13.86 11.2864L16.4342 8.71309C17.1168 8.03049 17.5002 7.10469 17.5002 6.13934C17.5002 5.174 17.1168 4.24819 16.4342 3.56559C15.7516 2.88299 14.8257 2.49951 13.8604 2.49951C12.8951 2.49951 11.9693 2.88299 11.2867 3.56559L9.99998 4.85226" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const githubIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="github-svg icon-invert"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.475 0 0 4.475 0 10C0 14.425 2.8625 18.1625 6.8375 19.4875C7.3375 19.575 7.525 19.275 7.525 19.0125C7.525 18.775 7.5125 17.9875 7.5125 17.15C5 17.6125 4.35 16.5375 4.15 15.975C4.0375 15.6875 3.55 14.8 3.125 14.5625C2.775 14.375 2.275 13.9125 3.1125 13.9C3.9 13.8875 4.4625 14.625 4.65 14.925C5.55 16.4375 6.9875 16.0125 7.5625 15.75C7.65 15.1 7.9125 14.6625 8.2 14.4125C5.975 14.1625 3.65 13.3 3.65 9.475C3.65 8.3875 4.0375 7.4875 4.675 6.7875C4.575 6.5375 4.225 5.5125 4.775 4.1375C4.775 4.1375 5.6125 3.875 7.525 5.1625C8.325 4.9375 9.175 4.825 10.025 4.825C10.875 4.825 11.725 4.9375 12.525 5.1625C14.4375 3.8625 15.275 4.1375 15.275 4.1375C15.825 5.5125 15.475 6.5375 15.375 6.7875C16.0125 7.4875 16.4 8.375 16.4 9.475C16.4 13.3125 14.0625 14.1625 11.8375 14.4125C12.2 14.725 12.5125 15.325 12.5125 16.2625C12.5125 17.6 12.5 18.675 12.5 19.0125C12.5 19.275 12.6875 19.5875 13.1875 19.4875C15.1726 18.8173 16.8976 17.5414 18.1197 15.8395C19.3418 14.1375 19.9994 12.0952 20 10C20 4.475 15.525 0 10 0Z" fill="black"/></svg>`;
const loader = document.querySelector(".loader");

const myProjects = {
  Smetfabriken: {
    image: "../images/smetfabriken.png",
    alt: "Graphic illustration of purple batter being stirred with a spatula in a bowl in front of a factory",
  },
  "U1-Portfoliosidan": {
    image: "../images/william-github.png",
    alt: "Blue and white geometric pixel art",
  },
};

const showRepos = [
  "U1-Portfoliosidan",
  "workshop-pig-game",
  "Volvo-landingpage",
  "U2-Portfolio-med-JavaScript",
  "Smetfabriken",
];

const defaultImage = "../images/william-github.png";

const projectGrid = document.querySelector(".project-grid");

async function getJson(url) {
  const oneHour = 60 * 60 * 1000;
  const saved = localStorage.getItem(url);

  if (saved) {
    const savedData = JSON.parse(saved);
    if (Date.now() - savedData.time < oneHour) {
      return savedData.data;
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    loader.classList.add("hidden");
    document.querySelector(".error-container").classList.remove("hidden");
    document.querySelector(".error-status").textContent = response.status;

    let finalErrorMessage = response.statusText;

    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        finalErrorMessage = errorData.message;
      }
    } catch (error) {}

    document.querySelector(".error-message").textContent = finalErrorMessage;
    throw new Error(
      `Error Github API (${response.status}): ${finalErrorMessage}`,
    );
  }

  const data = await response.json();

  localStorage.setItem(url, JSON.stringify({ time: Date.now(), data: data }));

  return data;
}

async function renderRepos(repo) {
  loader.classList.remove("hidden");

  try {
    const result = await getJson(
      "https://api.github.com/users/chasacademy-william-engman/repos",
    );

    const articles = [];

    for (const repo of result) {
      if (!showRepos.includes(repo.name)) continue;

      const extra = myProjects[repo.name] || {};

      const languages = await getJson(repo.languages_url);
      const techStack = Object.keys(languages).join(", ") || "No languages";

      const article = document.createElement("article");
      article.classList.add("project-card");

      const img = document.createElement("img");
      img.classList.add("card-logo");
      img.src = extra.image || defaultImage;
      img.alt = extra.alt || "";

      const info = document.createElement("div");
      info.classList.add("info");

      const h2 = document.createElement("h2");
      h2.textContent = repo.name;

      const description = document.createElement("p");
      description.classList.add("description");
      description.textContent = repo.description || "No description yet";

      const tech = document.createElement("p");
      tech.classList.add("tech-stack");
      const strong = document.createElement("strong");
      strong.textContent = "Tech Stack : ";
      tech.append(strong, techStack);

      const links = document.createElement("div");
      links.classList.add("links");

      if (repo.has_pages) {
        const liveLink = document.createElement("a");
        liveLink.href = `https://chasacademy-william-engman.github.io/${repo.name}/`;
        liveLink.target = "_blank";
        liveLink.innerHTML = linkIcon;
        liveLink.append("Live Preview");
        links.append(liveLink);
      }

      const codeLink = document.createElement("a");
      codeLink.href = repo.html_url;
      codeLink.target = "_blank";
      codeLink.innerHTML = githubIcon;
      codeLink.append("View Code");
      links.append(codeLink);

      info.append(h2, description, tech, links);
      article.append(img, info);
      articles.push(article);
    }

    loader.classList.add("hidden");
    projectGrid.append(...articles);
    projectGrid.classList.remove("hidden");
  } catch (error) {
    console.log(error.message);
  }
}
renderRepos();

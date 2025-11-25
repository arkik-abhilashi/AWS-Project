const form = document.getElementById("builder-form");
const previewDiv = document.getElementById("preview");
const downloadBtn = document.getElementById("download-btn");

const saved = JSON.parse(localStorage.getItem("portfolioData") || "{}");
["name", "title", "about", "skills", "projects", "github", "linkedin"].forEach(
  (id) => {
    if (saved[id]) {
      document.getElementById(id).value = saved[id];
    }
  }
);

renderPreview();

form.addEventListener("input", () => {
  const data = getFormData();
  localStorage.setItem("portfolioData", JSON.stringify(data));
  renderPreview();
});

downloadBtn.addEventListener("click", () => {
  const htmlContent = generateStandaloneHTML(getFormData());
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "my-portfolio.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function getFormData() {
  return {
    name: document.getElementById("name").value || "Your Name",
    title: document.getElementById("title").value || "Your Title",
    about:
      document.getElementById("about").value ||
      "Write something about yourself.",
    skills: document
      .getElementById("skills")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    projects: document
      .getElementById("projects")
      .value.split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    github: document.getElementById("github").value,
    linkedin: document.getElementById("linkedin").value,
  };
}

function renderPreview() {
  const data = getFormData();
  previewDiv.innerHTML = getPortfolioHTML(data, false);
}

function getPortfolioHTML(data, standalone = false) {
  const projectsHTML = data.projects
    .map((p) => `<div class="project-item">• ${p}</div>`)
    .join("");

  const skillsHTML = data.skills
    .map((s) => `<span class="skill-badge">${s}</span>`)
    .join("");

  const linksHTML = `
    <p>
      ${data.github ? `GitHub: <a href="${data.github}">${data.github}</a><br/>` : ""}
      ${data.linkedin ? `LinkedIn: <a href="${data.linkedin}">${data.linkedin}</a>` : ""}
    </p>
  `;

  const inner = `
    <div class="portfolio">
      <div class="portfolio-header">
        <h1>${data.name}</h1>
        <p>${data.title}</p>
      </div>

      <section>
        <h2 class="section-title">About</h2>
        <p>${data.about}</p>
      </section>

      <section>
        <h2 class="section-title">Skills</h2>
        <div class="skill-badges">
          ${skillsHTML || "<p>No skills added yet.</p>"}
        </div>
      </section>

      <section>
        <h2 class="section-title">Projects</h2>
        <div>
          ${projectsHTML || "<p>No projects added yet.</p>"}
        </div>
      </section>

      <section>
        <h2 class="section-title">Contact</h2>
        ${linksHTML}
      </section>
    </div>
  `;

  if (!standalone) return inner;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${data.name} - Portfolio</title>
<style>
  body { background:#f5f5f7; color:#111827; font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; padding:1.5rem; }
  a { color:#ea580c; text-decoration:none; }
  a:hover { text-decoration:underline; }
  .portfolio { max-width:700px; margin:0 auto; background:#ffffff; border-radius:0.9rem; padding:1.5rem; border:1px solid #e5e7eb; box-shadow:0 8px 20px rgba(15,23,42,0.05); }
  .portfolio-header { text-align:center; margin-bottom:1rem; }
  .portfolio-header h1 { font-size:2rem; margin-bottom:0.25rem; }
  .portfolio-header p { color:#6b7280; }
  .section-title { font-size:1.1rem; margin:1rem 0 0.4rem; border-bottom:1px solid #e5e7eb; padding-bottom:0.25rem; font-weight:600; color:#111827; }
  .skill-badges { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.25rem; }
  .skill-badge { padding:0.2rem 0.6rem; border-radius:999px; border:1px solid #e5e7eb; font-size:0.85rem; background:#f3f4f6; color:#111827; }
  .project-item { margin-bottom:0.4rem; color:#111827; }
</style>
</head>
<body>
${inner}
</body>
</html>`;
}

function generateStandaloneHTML(data) {
  return getPortfolioHTML(data, true);
}

const API_URL = "http://localhost:8080/api/projects";

const button = document.getElementById("loadProjects");
const projectsContainer = document.getElementById("projects");
const projectForm = document.getElementById("projectForm");
const formMessage = document.getElementById("formMessage");

button.addEventListener("click", loadProjects);

async function loadProjects() {
projectsContainer.innerHTML = "<p>Carregando projetos...</p>";

try {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Não foi possível buscar os projetos.");
    }

    const projects = await response.json();

    if (projects.length === 0) {
        projectsContainer.innerHTML =
            "<p>Nenhum projeto cadastrado ainda.</p>";
        return;
    }

    projectsContainer.innerHTML = "";

    projects.forEach(project => {
        const card = document.createElement("article");
        card.className = "project-card";

        const title = document.createElement("h3");
        title.textContent =
            project.name || project.title || "Projeto sem título";

        const description = document.createElement("p");
        description.textContent =
            project.description || "Sem descrição disponível.";

        card.appendChild(title);
        card.appendChild(description);

        if (project.url) {
            const link = document.createElement("a");
            link.href = project.url;
            link.textContent = "Acessar projeto";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            card.appendChild(link);
        }

        projectsContainer.appendChild(card);
    });
} catch (error) {
    projectsContainer.innerHTML =
        "<p>Não foi possível carregar os projetos. Verifique se a API está funcionando.</p>";

    console.error("Erro ao carregar projetos:", error);
}

}

projectForm.addEventListener("submit", async function(event) {
event.preventDefault();

const project = {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    url: document.getElementById("url").value.trim() || null
};

formMessage.textContent = "Salvando projeto...";

try {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || ´ Erro HTTP ${response.status}´);
    }

    formMessage.textContent = "Projeto cadastrado com sucesso!";
    projectForm.reset();

    await loadProjects();
} catch (error) {
    formMessage.textContent =
        "Não foi possível cadastrar o projeto. Verifique se a API está funcionando e consulte o console.";

    console.error("Erro ao cadastrar projeto:", error);
}

});
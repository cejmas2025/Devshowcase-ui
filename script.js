const API_URL = "http://localhost:8080/api/projects";

const button = document.getElementById("loadProjects");
const projectsContainer = document.getElementById("projects");

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
            title.textContent = project.title || project.name || "Projeto sem título";

            const description = document.createElement("p");
            description.textContent =
                project.description || "Sem descrição disponível.";

            card.appendChild(title);
            card.appendChild(description);
            projectsContainer.appendChild(card);
        });
    } catch (error) {
        projectsContainer.innerHTML =
            "<p>Não foi possível carregar os projetos. Verifique se a API está funcionando.</p>";

        console.error("Erro ao carregar projetos:", error);
    }
}
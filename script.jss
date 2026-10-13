const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalCount = document.getElementById("total");
const pendingCount = document.getElementById("pending");
const completedCount = document.getElementById("completed");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks") || "[]");
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function updateStats() {
    totalCount.textContent = tasks.length;
    pendingCount.textContent = tasks.filter(task => !task.completed).length;
    completedCount.textContent = tasks.filter(task => task.completed).length;
}

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + task.text));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        item.appendChild(label);
        item.appendChild(deleteButton);
        taskList.appendChild(item);
    });

    updateStats();
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
});

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();

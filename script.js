const STORAGE_KEY = "tasks"; // Key for localStorage


function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    try { 
        return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        return [];
    }
}


function saveTasks(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

let tasks = loadTasks();
let currentFilter = "";


const taskInput   = document.querySelector("#task-input");
const searchInput = document.querySelector("#search-input");
const taskList = document.querySelector("#task-list");
const taskForm    = document.querySelector("#task-form");
const perc = document.querySelector("#task-count");


function renderTasks() {

     const visible = tasks.filter(t =>
         t.text.toLowerCase().includes(currentFilter)
     );


        const total = tasks.length;
        const done  = tasks.filter(t => t.done).length;
        perc.textContent = total
            ? `${done} / ${total} (${Math.round((done / total) * 100)}%)`
            : "No tasks yet";

    saveTasks(tasks);
    taskList.innerHTML = ""; // Clear existing tasks
    visible.forEach(task => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = task.text;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", function() {
            tasks = tasks.filter(t => t.id !== task.id);
            renderTasks();
        });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", function() {
            task.done = checkbox.checked;
            if (task.done) {
                span.style.textDecoration = "line-through";
            } else {
                span.style.textDecoration = "none";
            }
            renderTasks(); 

        });

        searchInput.addEventListener("input", () => {
            currentFilter = searchInput.value.toLowerCase().trim();
            renderTasks();
        });
        



        li.append(span, delBtn, checkbox);
        taskList.appendChild(li);
    });
}



taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if(!taskInput.value.trim()) {
        alert("Please enter a task.");
        return;
    }
    const newTask = {
        id: Date.now().toString(),   
        text: taskInput.value.trim(),
        done: false
    };
    tasks.push(newTask);
    renderTasks(tasks);

    taskInput.value = ""; // Clear input field after adding task
    taskInput.focus(); // Set focus back to input field
});


renderTasks();
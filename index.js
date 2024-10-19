document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
  
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let tasksFromAPI = [];
  
    // Fetch tasks from API
    const getTask = async () => {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      tasksFromAPI = res.data; // Store the tasks from the API
      renderTodos();
    };
  
    // Send POST request to add a new task
    const addTaskToAPI = async (title) => {
      try {
        await axios.post("https://jsonplaceholder.typicode.com/todos", {
          title: title,
          completed: false,
        });
        // Fetch the updated tasks after adding
        getTask();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    };
  
    // Send DELETE request to remove a task
    const deleteTaskFromAPI = async (id) => {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
        // Fetch the updated tasks after deletion
        getTask();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };
  
    // Render all tasks (from API and local storage)
    function renderTodos() {
      todoList.innerHTML = "";
  
      // First, render tasks from API
      tasksFromAPI.forEach((task) => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.setAttribute("data-id", task.id);
        if (task.completed) {
          todoItem.classList.add("completed");
        }
        todoItem.innerHTML = `
            <input class="form-check-input" type="checkbox" id="todo-${
              task.id
            }" ${task.completed ? "checked" : ""}>
            <label class="form-check-label todo-text" for="todo-${task.id}">${
          task.title
        }</label>
            <button type="button" class="btn-close" aria-label="Close" data-id="${
              task.id
            }"></button>
          `;
        todoList.appendChild(todoItem);
  
        // Handle delete button click
        const closeButton = todoItem.querySelector(".btn-close");
        closeButton.addEventListener("click", () => {
          deleteTaskFromAPI(task.id); // Send DELETE request to remove the task
        });
      });
  
      // Then, render local todos
      todos.forEach((todo, index) => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.setAttribute("data-id", index);
        if (todo.completed) {
          todoItem.classList.add("completed");
        }
        todoItem.innerHTML = `
            <input class="form-check-input" type="checkbox" id="todo-${index}" ${
          todo.completed ? "checked" : ""
        }>
            <label class="form-check-label todo-text" for="todo-${index}">${
          todo.text
        }</label>
            <button type="button" class="btn-close" aria-label="Close" data-id="${index}"></button>
          `;
        todoList.appendChild(todoItem);
  
        const closeButton = todoItem.querySelector(".btn-close");
        closeButton.addEventListener("click", () => {
          todos.splice(index, 1);
          saveTodos();
          renderTodos();
        });
      });
    }
  
    // Save local todos to localStorage
    function saveTodos() {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  
    // Handle form submission for new tasks
    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const todoText = todoInput.value.trim();
      if (todoText) {
        addTaskToAPI(todoText); // Send POST request to add the new task to the API
        todos.push({ text: todoText, completed: false });
        todoInput.value = "";
        saveTodos();
        renderTodos();
      }
    });
  
    // Fetch tasks from API and render everything on page load
    getTask();
  });
  
// Make the DIV elements draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("appyapp"));
dragElement(document.getElementById("todoapp"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header (the full top bar).
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var welcomeScreen = document.querySelector("#welcome");

var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

var appyAppScreen = document.querySelector("#appyapp");

var appyAppScreenClose = document.querySelector("#appyappclose");

var topBar = document.querySelector("#topbar");
var biggestIndex = 1;

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
}

function handleWindowTap(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
}

welcomeScreen.addEventListener("mousedown", function() {
  handleWindowTap(welcomeScreen);
});

appyAppScreen.addEventListener("mousedown", function() {
  handleWindowTap(appyAppScreen);
});

welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

// Stop the close button's mousedown from bubbling up to the header,
// which is what triggers dragging. Without this, pressing "Close"
// would start a drag instead of (or as well as) closing the window.
welcomeScreenClose.addEventListener("mousedown", function(e) {
  e.stopPropagation();
});

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

appyAppScreenClose.addEventListener("click", function() {
  closeWindow(appyAppScreen);
});

appyAppScreenClose.addEventListener("mousedown", function(e) {
  e.stopPropagation();
});

var selectedIcon = undefined;

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element
} 

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined;
} 

function handleIconTap(iconElement, windowElement) {
    if (iconElement.classList.contains("selected")) {
        deselectIcon(iconElement)
        openWindow(windowElement)
    } else {
        selectIcon(iconElement)
    }
}

document.querySelector("#appyappicon").addEventListener("click", function() {
  handleIconTap(this, appyAppScreen);
});

document.querySelector("#todoappicon").addEventListener("click", function() {
  handleIconTap(this, todoAppScreen);
});

var content = [
  {
    title: "Welcome",
    date: "08/09/2026",
    content: `
      <h2>Welcome to Appy App</h2>
      <p>This is where notes are stored</p>
    `
  },
  {
    title: "First Entry",
    date: "09/08/2026",
    content: `
      <h2>First Entry</h2>
      <p>Blah Blah Blah</p>
    `
  },
  {
    title: "Ideas",
    date: "09/08/2026",
    content: `
      <h2>Ideas</h2>
      <p>Ideas and notes</p>
    `
  }
];

function setAppyAppContent(index) {
  var note = content[index];
  var contentDiv = document.querySelector("#appyappcontent");
  contentDiv.innerHTML = note.content;
}

function addToSideBar(index) {
  var sidebar = document.querySelector("#appyappsidebar");
  var note = content[index];

  var newDiv = document.createElement("div");
  newDiv.style.cursor = "pointer";
  newDiv.style.margin = "14px";

  newDiv.innerHTML = `
    <p style="margin: 0px;">${note.title}</p>
    <p style="margin: 0px;">${note.date}</p>
  `;

  newDiv.addEventListener("click", function() {
    setAppyAppContent(index);
  });

  sidebar.appendChild(newDiv);
}

for (var i = 0; i < content.length; i++) {
  addToSideBar(i)
}

setAppyAppContent(0);

// ----- To-Do List app -----

var todoAppScreen = document.querySelector("#todoapp");
var todoAppScreenClose = document.querySelector("#todoappclose");
var todoInput = document.querySelector("#todoinput");
var todoAddBtn = document.querySelector("#todoaddbtn");
var todoListDiv = document.querySelector("#todolist");

var todos = [];

function renderTodos() {
  todoListDiv.innerHTML = "";

  if (todos.length === 0) {
    var emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No tasks yet - add one above.";
    emptyMessage.style.opacity = "0.6";
    todoListDiv.appendChild(emptyMessage);
    return;
  }

  todos.forEach(function(todo, index) {
    var row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.marginBottom = "6px";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", function() {
      todo.done = checkbox.checked;
      renderTodos();
    });

    var label = document.createElement("span");
    label.textContent = todo.text;
    label.style.flex = "1";
    if (todo.done) {
      label.style.textDecoration = "line-through";
      label.style.opacity = "0.6";
    }

    var deleteBtn = document.createElement("span");
    deleteBtn.textContent = "x";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.color = "#900";
    deleteBtn.addEventListener("click", function() {
      todos.splice(index, 1);
      renderTodos();
    });

    row.appendChild(checkbox);
    row.appendChild(label);
    row.appendChild(deleteBtn);
    todoListDiv.appendChild(row);
  });
}

function addTodo() {
  var text = todoInput.value.trim();
  if (text === "") return;
  todos.push({ text: text, done: false });
  todoInput.value = "";
  renderTodos();
}

todoAddBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") addTodo();
});

todoAppScreen.addEventListener("mousedown", function() {
  handleWindowTap(todoAppScreen);
});

todoAppScreenClose.addEventListener("click", function() {
  closeWindow(todoAppScreen);
});

todoAppScreenClose.addEventListener("mousedown", function(e) {
  e.stopPropagation();
});

renderTodos();
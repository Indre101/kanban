window.addEventListener("DOMContentLoaded", init);

const url = "https://deleteme-6090.restdb.io/rest/";
const apiKey = "5e9570bb436377171a0c2315";
let addedNewItem = true;
let appendToTheEnd = true;

function init() {
  getProgressCards("progress", displayProgresscards);
  showTaskOrganiser();

  document.querySelector(".cancel").onclick = function () {
    event.preventDefault();
    document.querySelector(".more-info-container").dataset.active = "false";
  };
}

function showTaskOrganiser() {
  document.querySelector(".start").onclick = function () {
    document.querySelector(".landing-page-container").dataset.active = "false";
  };
}

function getProgressCards(path, functiontoCall) {
  fetch(url + path, {
    method: "get",
    headers: {
      "Content-type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
  })
    .then((res) => res.json())
    .then((data) => data.forEach(functiontoCall))
    .then(() => {
      getTodoItems();
      hidePreloader();
    });
}

function displayProgresscards(progress) {
  const template = document.querySelector("template").content;
  const cln = template.cloneNode(true);
  cln.querySelector(".card-boxes").dataset.id = progress._id;
  cln.querySelector("h2").textContent = progress.title;
  const list = cln.querySelector(".list");
  const inputValue = cln.querySelector(".primaryInput");
  const todoSmallForm = cln.querySelector("form");
  inputValue.addEventListener("click", () => {
    document
      .querySelectorAll(".actionstodo")
      .forEach((actionItem) => (actionItem.dataset.active = "false"));
  });

  todoSmallForm.addEventListener("submit", (e) => {
    const todo = {
      title: inputValue.value,
      progresscard: progress,
    };

    addItem(todo, progress);
    todoSmallForm.reset();
  });

  cln.querySelector(".moreNewitem").addEventListener("click", () => {
    addedNewItem = true;
    setDefaultTodaysDate();
    document.querySelector("#shortName").value = inputValue.value;
    addMoredetails(inputValue, progress);
  });
  document.querySelector(".cards-Container").appendChild(cln);
}

const setDefaultTodaysDate = () => {
  const today = new Date();
  const todayFormated = today.toISOString().slice(0, 10);
  document.querySelector("#dateAdded").value = todayFormated;
  document.querySelector("#dueDate").setAttribute("min", todayFormated);
};

function addMoredetails(inputValue, progress) {
  event.preventDefault();
  document.querySelector(".more-info-container").dataset.active = "true";
  const formMoreInfo = document.querySelector(".more-info-inner");
  setDefaultSelected(progress);
  document
    .querySelector(".submitLongform")
    .addEventListener("click", (event) => {
      event.preventDefault();

      if (addedNewItem) {
        appendToTheEnd = false;
        const testingOne = getSelecedCategory().then((data) => {
          const newListItem = {
            title: document.querySelector("#shortName").value,
            description: document.querySelector(".description").value,
            estimate: document.querySelector("#estimate").value,
            deadline: document.querySelector("#dueDate").value,
            author: document.querySelector("#author").value,
            dateadded: document.querySelector("#dateAdded").value,
            progresscard: data[0],
          };
          postTodo(newListItem);
          inputValue.value = "";
          formMoreInfo.reset();
        });
      } else {
        console.log(inputValue);
        const testingOne = getSelecedCategory().then((data) => {
          const newListItem = {
            title: document.querySelector("#shortName").value,
            description: document.querySelector(".description").value,
            estimate: document.querySelector("#estimate").value,
            deadline: document.querySelector("#dueDate").value,
            author: document.querySelector("#author").value,
            dateadded: document.querySelector("#dateAdded").value,
            progresscard: data[0],
          };

          appendToTheEnd =
            progress._id === newListItem.progresscard._id ? false : true;

          updateTodo(event, inputValue._id, newListItem);
        });
      }
    });
}

function setDefaultSelected(progress) {
  const options = document.querySelectorAll("option");

  options.forEach((optionItem) => {
    if (optionItem.value === progress.title) {
      optionItem.selected = true;
    }
  });
}

function postTodo(newListItem) {
  fetch(`https://deleteme-6090.restdb.io/rest/card`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
    body: JSON.stringify(newListItem),
  })
    .then((res) => res.json())

    .then((todo) => {
      displayTodo(todo);
    });
  document.querySelector(".more-info-container").dataset.active = "false";
}

async function getSelecedCategory() {
  const options = [...document.querySelectorAll("option")];
  const selectedOption = options.filter((item) => item.selected);
  const selectedProgress = await fetch(url + "progress", {
    method: "get",
    headers: {
      "Content-type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
  });

  const response = await selectedProgress.json();

  const selectedProgressItem = selectProgress(response, selectedOption);

  return selectedProgressItem;
}

const selectProgress = (data, selectedOption) =>
  data.filter(
    (processItem) =>
      processItem.title === selectedOption[0].value && processItem
  );

const hidePreloader = () =>
  (document.querySelector(".preloader").dataset.active = "false");

function getTodoItems() {
  fetch(url + "card", {
    method: "get",
    headers: {
      "Content-type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
  })
    .then((res) => res.json())
    .then((data) => data.forEach((item) => displayTodo(item)));
}

function displayTodo(inputValue) {
  const listItemtemplate = document.querySelector(".list-item-template")
    .content;
  const listItemcln = listItemtemplate.cloneNode(true);
  const listItem = listItemcln.querySelector(".list-item");
  listItem.dataset.id = inputValue._id;
  const textArea = listItemcln.querySelector(".secondaryInput");
  textArea.value = inputValue.title;
  textArea.dataset.parent = inputValue._id;
  addEvenListenerToExpand(textArea);
  const actionstodo = listItemcln.querySelector(".actionstodo");
  actionstodo.dataset.parent = inputValue._id;

  listItem.addEventListener("click", () => {
    const actionsTodos = document.querySelectorAll(".actionstodo");
    actionsTodos.forEach((element) => {
      element.dataset.active = "false";
    });
    listItem.querySelector(".actionstodo").dataset.active = "true";
  });

  listItemcln
    .querySelector(".delete")
    .addEventListener("click", () => deleteItem(inputValue._id));

  listItemcln.querySelector(".save").addEventListener("click", () => {
    appendToTheEnd = false;
    listItem.querySelector(".actionstodo").dataset.active = "false";
    const updatedTodo = {
      title: textArea.value,
    };
    updateTodo(event, inputValue._id, updatedTodo);
  });

  listItemcln.querySelector(".more").addEventListener("click", () => {
    console.log(inputValue);
    addedNewItem = false;
    event.preventDefault();
    assignDetailedValues(inputValue);
    addMoredetails(inputValue, inputValue.progresscard[0]);
  });

  document
    .querySelector(`[data-id="${inputValue.progresscard[0]._id}"] .list`)
    .append(listItemcln);
}

function assignDetailedValues(todo) {
  console.log(todo);
  event.preventDefault();
  const dueDate = todo.deadline
    ? new Date(todo.deadline).toISOString().slice(0, 10)
    : null;

  const datecreated = todo.dateadded
    ? new Date(todo.dateadded).toISOString().slice(0, 10)
    : null;

  const today = new Date();
  const todayFormated = today.toISOString().slice(0, 10);
  document.querySelector("#dueDate").setAttribute("min", todayFormated);
  document.querySelector(".more-info-container").dataset.active = "true";
  document.querySelector("#shortName").value = todo.title ? todo.title : null;
  document.querySelector(".description").value = todo.description
    ? todo.description
    : null;
  document.querySelector("#estimate").value = todo.estimate
    ? todo.estimate
    : null;
  document.querySelector("#dueDate").value = dueDate;
  document.querySelector("#author").value = todo.author ? todo.author : null;
  document.querySelector("#dateAdded").value = datecreated;
  setDefaultSelected(todo.progresscard[0]);
}

function updateTodo(event, id, newTodo) {
  event.preventDefault();
  let postData = JSON.stringify(newTodo);
  fetch(`https://deleteme-6090.restdb.io/rest/card/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((d) => d.json())
    .then((item) => assingUpdatedValues(item));
}

function assingUpdatedValues(todo) {
  console.log(todo);

  const itemInTheDom = document.querySelector(`[data-id="${todo._id}"]`);
  itemInTheDom.querySelector("textarea").value = todo.title;

  if (!appendToTheEnd) {
    appendToTheEnd = true;

    return false;
  } else {
    itemInTheDom.remove();
    document
      .querySelector(`[data-id="${todo.progresscard[0]._id}"] .list`)
      .append(itemInTheDom);
  }
  document.querySelector(".more-info-container").dataset.active = "false";
}

function deleteItem(itemId) {
  event.preventDefault();
  document.querySelector(`[data-id="${itemId}"]`).remove();
  fetch(`https://deleteme-6090.restdb.io/rest/card/${itemId}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
  }).then((res) => res.json());
}

function addItem(inputValue, progress) {
  event.preventDefault();
  postTodo(inputValue, progress);
}

function addAutoExpand() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(addEvenListenerToExpand);
}

function addEvenListenerToExpand(area) {
  area.addEventListener(
    "input",
    function (event) {
      if (event.target.tagName.toLowerCase() !== "textarea") return;
      autoExpand(event.target);
    },
    false
  );
}

const autoExpand = (field) => {
  // Reset field height
  field.style.height = "inherit";

  // Get the computed styles for the element
  var computed = window.getComputedStyle(field);

  // Calculate the height
  var height =
    parseInt(computed.getPropertyValue("border-top-width"), 10) +
    parseInt(computed.getPropertyValue("padding-top"), 10) +
    field.scrollHeight +
    parseInt(computed.getPropertyValue("padding-bottom"), 10) +
    parseInt(computed.getPropertyValue("border-bottom-width"), 10);

  field.style.height = height + "px";
};

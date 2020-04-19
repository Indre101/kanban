window.addEventListener("DOMContentLoaded", init);

const url = "https://deleteme-6090.restdb.io/rest/";
const apiKey = "5e9570bb436377171a0c2315";

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

  todoSmallForm.addEventListener("submit", (e) => {
    const todo = {
      title: inputValue.value,
      progresscard: progress,
    };

    addItem(todo, progress);
    todoSmallForm.reset();
  });

  cln.querySelector(".more").addEventListener("click", (event) => {
    setDefaultTodaysDate();
    addMoredetails(inputValue, progress, list);
    setDefaultSelected(progress);
  });
  document.querySelector(".cards-Container").appendChild(cln);
}

const setDefaultTodaysDate = () => {
  const today = new Date();
  const todayFormated = today.toISOString().slice(0, 10);
  document.querySelector("#dateAdded").value = todayFormated;
  document.querySelector("#dueDate").setAttribute("min", todayFormated);
};

function addMoredetails(inputValue, progress, parent) {
  document.querySelector(".more-info-container").dataset.active = "true";
  document.querySelector("#shortName").value = inputValue.value;
  const formMoreInfo = document.querySelector(".more-info-inner");

  // document.querySelector(".submitLongform")
  document.querySelector(".more-info-inner").addEventListener("submit", () => {
    event.preventDefault();
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
      console.log(newListItem.progresscard);
      postTodo(newListItem);
      inputValue.value = "";
      formMoreInfo.reset();
    });
  });
}

function setDefaultSelected(progress) {
  const options = document.querySelectorAll("option");

  console.log(getSelecedCategory());
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

  console.log(selectedProgressItem);
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
  textArea.textContent = inputValue.title ? inputValue.title : inputValue.value;
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
    listItem.querySelector(".actionstodo").dataset.active = "false";
    updateTodo(inputValue);
  });

  listItemcln.querySelector(".more").addEventListener("click", () => {
    event.preventDefault();

    assignDetailedValues(inputValue);
  });
  console.log(inputValue);

  console.log(inputValue.progresscard[0]._id);
  document
    .querySelector(`[data-id="${inputValue.progresscard[0]._id}"] .list`)
    .append(listItemcln);
}

function assignDetailedValues(todo) {
  event.preventDefault();
  const dueDate = new Date(todo.deadline);
  const dueDateFormated = dueDate.toISOString().slice(0, 10);

  const datecreated = new Date(todo.dateadded);
  const dateCreatedFormated = datecreated.toISOString().slice(0, 10);
  document.querySelector("#dueDate").setAttribute("min", todayFormated);

  document.querySelector(".more-info-container").dataset.active = "true";
  document.querySelector("#shortName").value = todo.title ? todo.title : null;
  document.querySelector(".description").value = todo.description
    ? todo.description
    : null;
  document.querySelector("#estimate").value = todo.estimate
    ? todo.estimate
    : null;
  document.querySelector("#dueDate").value = dueDateFormated
    ? dueDateFormated
    : null;
  document.querySelector("#author").value = todo.author ? todo.author : null;

  document.querySelector("#dateAdded").value = dateCreatedFormated
    ? dateCreatedFormated
    : null;
  setDefaultSelected(todo.progresscard[0]);
}

function updateTodo(todo) {
  event.preventDefault();
  const todoItemIntheDom = document.querySelector(`[data-id="${todo._id}"]`);
  const newBand = {
    title: todoItemIntheDom.querySelector("textarea").value,
  };
  let postData = JSON.stringify(newBand);
  fetch(`https://deleteme-6090.restdb.io/rest/card/${todo._id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((d) => d.json())
    .then((item) => assingUpdatedValues(item, todoItemIntheDom));
}

function assingUpdatedValues(todo, todoItemIntheDom) {
  todoItemIntheDom.querySelector("textarea").value = todo.title;
  console.log(todo);
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
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
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

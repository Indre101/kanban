window.addEventListener("DOMContentLoaded", init);

const url = "https://deleteme-6090.restdb.io/rest/";
const apiKey = "5e9570bb436377171a0c2315";

function init() {
  getProgressCards("progress", displayProgresscards);
  showTaskOrganiser();
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
    .then((data) => data.forEach(functiontoCall));
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

  getTodoItems(progress._id, list);
  document.querySelector(".cards-Container").appendChild(cln);
}

const setDefaultTodaysDate = () => {
  document.querySelector("#dateAdded").valueAsDate = new Date();
};

function addMoredetails(inputValue, progress, parent) {
  document.querySelector(".cancel").onclick = function () {
    document.querySelector(".more-info-container").dataset.active = "false";
  };
  document.querySelector(".more-info-container").dataset.active = "true";
  document.querySelector("#shortName").value = inputValue.value;
  const formMoreInfo = document.querySelector(".more-info-inner");

  document.querySelector(".submitLongform").onclick = function () {
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
      postTodo(newListItem, newListItem.progresscard);
      inputValue.value = "";
    });
  };
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

function postTodo(inputValue, progress) {
  fetch(`https://deleteme-6090.restdb.io/rest/card`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
    body: JSON.stringify(inputValue),
  })
    .then((res) => res.json())

    .then((d) => {
      handleTodo(progress._id, d);
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

function getTodoItems(id, parent) {
  fetch(url + "card", {
    method: "get",
    headers: {
      "Content-type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
  })
    .then((res) => res.json())
    .then((data) => data.forEach((item) => handleTodo(id, item)));
}

function handleTodo(id, inputValue) {
  if (inputValue.progresscard[0]._id === id) {
    displayTodo(inputValue);
  } else {
    return false;
  }
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

  listItem.addEventListener("click", () => {
    actionstodo.dataset.active =
      actionstodo.dataset.active === "false" ? "true" : "false";
  });

  listItemcln
    .querySelector(".delete")
    .addEventListener("click", () => deleteItem(inputValue._id));

  document
    .querySelector(`[data-id="${inputValue.progresscard[0]._id}"] .list`)
    .append(listItemcln);
  hidePreloader();
}

function updateTodo(id, textArea) {
  event.preventDefault();
  document.querySelector(".more-info-container").dataset.active = "true";
  // const newBand = {
  //   title: textArea.id,
  // };
  // let postData = JSON.stringify(newBand);
  // fetch(`https://deleteme-6090.restdb.io/rest/progress/${progress._id}`, {
  //   method: "put",
  //   headers: {
  //     "Content-Type": "application/json; charset=utf-8",
  //     "x-apikey": "5e9570bb436377171a0c2315",
  //     "cache-control": "no-cache",
  //   },
  //   body: postData,
  // })
  //   .then((d) => d.json())
  //   .then((t) => console.log(t.cards));
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

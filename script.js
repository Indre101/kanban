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

  cln.querySelector(".add").addEventListener("click", () => {
    addItem(inputValue, progress, list);
    inputValue.value = "";
  });

  getTodoItems(progress._id, list);
  document.querySelector(".cards-Container").appendChild(cln);
}
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
    .then((data) => data.forEach((item) => handleTodo(id, parent, item)));
}

function handleTodo(id, parent, inputValue) {
  if (inputValue.progresscard[0]._id === id) {
    displayTodo(inputValue, parent);
  } else {
    false;
  }
}

function displayTodo(inputValue, parent) {
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

  listItemcln.querySelector(".edit").addEventListener("click", () => {
    updateTodo(inputValue._id, textArea);
  });

  parent.append(listItemcln);
  hidePreloader();
}

function updateTodo(id, textArea) {
  event.preventDefault();
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

function addItem(inputValue, progress, parent) {
  event.preventDefault();
  postTodo(inputValue, progress, parent);
}

function postTodo(inputValue, progress, parent) {
  const newListItem = {
    title: inputValue.value,
    progresscard: progress,
  };
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

    .then((d) => {
      console.log(d);
      handleTodo(progress._id, parent, d);
    });
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

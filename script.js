window.addEventListener("DOMContentLoaded", init);

function init() {
  getData("progress", appendProgressCards);
}

function getData(path, functiontoCall) {
  fetch("https://deleteme-6090.restdb.io/rest/" + path, {
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

function appendProgressCards(progress) {
  const template = document.querySelector("template").content;
  const cln = template.cloneNode(true);
  cln.querySelector(".card-boxes").dataset.id = progress._id;
  cln.querySelector("h2").textContent = progress.title;
  const list = cln.querySelector(".list");
  const inputValue = cln.querySelector(".primaryInput");
  progress.cards.forEach((todoItem) => displayTodos(todoItem.title, list));
  cln
    .querySelector(".add")
    .addEventListener("click", () => addItem(inputValue, progress, list));

  document.querySelector(".cards-Container").appendChild(cln);
  // addAutoExpand();
}

function addItem(inputValue, progress, parent) {
  event.preventDefault();
  postTodo(inputValue.value, progress);
  displayTodos(inputValue.value, parent);
}

function displayTodos(inputValue, parent) {
  const listItemtemplate = document.querySelector(".list-item-template")
    .content;
  const listItemcln = listItemtemplate.cloneNode(true);
  const textArea = listItemcln.querySelector(".secondaryInput");
  textArea.textContent = inputValue;
  addEvenListenerToExpand(textArea);
  parent.append(listItemcln);
}

function postTodo(inputValue, progress) {
  const newListItem = {
    title: inputValue,
    progresscard: progress,
  };
  updateProgressCard(progress, newListItem);
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
    .then((d) => console.log(d));
}

function updateProgressCard(progress, item) {
  const newBand = {
    $push: { cards: item },
  };
  let postData = JSON.stringify(newBand);
  fetch(`https://deleteme-6090.restdb.io/rest/progress/${progress._id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5e9570bb436377171a0c2315",
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((d) => d.json())
    .then((t) => console.log(t));
}

// function deleteItem(id) {
//   fetch(`https://deleteme-6090.restdb.io/rest/bands/${id}`, {
//     method: "delete",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       "x-apikey": "5e9570bb436377171a0c2315",
//       "cache-control": "no-cache",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// }

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

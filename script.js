window.addEventListener("DOMContentLoaded", init);

function init() {
  getData("progress", appendProgressCards);
}

function createCards(path) {}

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
  console.log(cln.querySelector("h2"));
  cln.querySelector("h2").textContent = progress.title;

  const inputValue = cln.querySelector(".primaryInput");
  cln
    .querySelector(".add")
    .addEventListener("click", () => addItem(inputValue));
  document.querySelector(".cards-Container").appendChild(cln);
}

function addItem(inputField) {
  event.preventDefault();
  console.log(inputField.value);
}

// function showData(element) {
//   console.log(element);
//   const template = document.querySelector("template").content;
//   const cln = template.cloneNode(true);
//   cln.querySelector(".name").textContent = element.name;
//   document.querySelector(".div").appendChild(cln);
// }

// function postItem() {
//   const newBand = {
//     name: "Backstreet boys",
//     yearStarted: "1995-10-20",
//     genre: "rock",
//   };

//   const postData = JSON.stringify(newBand);
//   fetch(`https://deleteme-6090.restdb.io/rest/bands`, {
//     method: "post",
//     headers: {
//       Accept: "application/json",
//       "Content-type": "application/json",
//       "x-apikey": "5e9570bb436377171a0c2315",
//       "cache-control": "no-cache",
//     },
//     body: postData,
//   })
//     .then((res) => res.json())
//     .then((d) => getData());
// }

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

// function putItem(params) {
//   const newBand = {
//     name: "Backstreet boys",
//     yearStarted: "1995-10-20",
//     genre: "rock",
//   };

//   let postData = JSON.stringify(data);

//   fetch(`https://deleteme-6090.restdb.io/rest/bands/${id}`, {
//     method: "put",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       "x-apikey": "5e9570bb436377171a0c2315",
//       "cache-control": "no-cache",
//     },
//     body: postData,
//   })
//     .then((d) => d.json())
//     .then((t) => console.log(t));
// }

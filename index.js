<<<<<<< Updated upstream
function logText() {
  var text = document.getElementById("textbox");
  console.log(text.value);
=======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  push,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://cart-57ccf-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListDB = ref(database, "shoppingList");

const add_btn = document.getElementById("add-btn");
const add_item = document.getElementById("add-item");
const shopping_list = document.getElementById("shopping-list");

onValue(shoppingListDB, function (snapshot) {
  clearList(shopping_list);
  if (snapshot.exists()) {
    let list = Object.entries(snapshot.val());
    addtoShoppingList(shopping_list, list);
    // console.log(list);
  }
});

add_btn.addEventListener("click", function (e) {
  push(shoppingListDB, add_item.value);
  resetInputField(add_item);
});

function resetInputField(inputElement) {
  inputElement.value = "";
}

function addtoShoppingList(listEle, list) {
  for (let i = 0; i < list.length; i++) {
    let newEle = document.createElement("li");
    newEle.textContent = list[i][1];
    newEle.addEventListener("dblclick", function () {
      let dbItem = ref(database, `shoppingList/${list[i][0]}`);
      remove(dbItem);
    });
    listEle.append(newEle);
  }
}

function clearList(listEle) {
  listEle.innerHTML = "";
>>>>>>> Stashed changes
}

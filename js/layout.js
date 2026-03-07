"use strict"

document.querySelector("#search input").value = "";

document.querySelector("#search input").addEventListener("input", (e) => {
  const close_icon = document.getElementById("close_icon");
  if (e.target.value === "") {
    close_icon.classList.remove("visible_icon");
    close_icon.classList.add("hidden_icon");
    console.log(e.target.value)
  }
  else {
    close_icon.classList.remove("hidden_icon");
    close_icon.classList.add("visible_icon");
  }
})

document.getElementById("close_icon").addEventListener("click", () => {
  document.querySelector("#search input").value = "";
  close_icon.classList.remove("visible_icon");
  close_icon.classList.add("hidden_icon");
  document.querySelector("#search input").focus()
})
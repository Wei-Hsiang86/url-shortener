function copyUrl() {
  const copyText = document.querySelector("#short-url").dataset.id;
  // console.log(copyText)

  navigator.clipboard
    .writeText(copyText)
    .then(() => alert("copied"))
    .catch((error) => console.log(error));
}
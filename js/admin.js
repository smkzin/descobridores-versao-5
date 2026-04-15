const editGamesBtn = document.getElementById("edit__games__btn");
const addGameBtn = document.getElementById("add__game__btn");
const backBtn = document.getElementById("admin__back__btn");
const editGamesContainer = document.getElementById("edit__games__container");
const addGameContainer = document.getElementById("add__game__container");
const adminContainerBtns = document.querySelector(".admin__container__btns");
const gameLists = document.querySelectorAll(".game__list");
const editIcons = document.querySelectorAll(".edit__icon");
const deleteIcons = document.querySelectorAll(".trash__icon");

let gamesData;

// FUNCTIONS
const changeElements = () => {
  adminContainerBtns.style.display = "none";
  backBtn.style.display = "block";
};

const editGame = (gameEl) => {
  const label = gameEl.querySelector("label");
  const submitIconsDiv = gameEl.querySelector(".submit__icons__div");
  const editIconsDiv = gameEl.querySelector(".edit__icons__div");
  const input = gameEl.querySelector("input");

  label.style.display = "none";
  editIconsDiv.style.display = "none";
  input.style.display = "block";
  submitIconsDiv.style.display = "block";
};

const cancelEditGame = (gameEl) => {
  const label = gameEl.querySelector("label");
  const submitIconsDiv = gameEl.querySelector(".submit__icons__div");
  const editIconsDiv = gameEl.querySelector(".edit__icons__div");
  const input = gameEl.querySelector("input");

  label.style.display = "block";
  editIconsDiv.style.display = "block";
  submitIconsDiv.style.display = "none";
  input.style.display = "none";
  input.value = "";
};

const submitEditGame = (gameEl) => {
  const value = gameEl.querySelector("input").value;

  if (value && value.length < 50) {
    updateGame({ id: gameEl.id, name: value })
      .then((response) => {
        if (response) {
          if (!alert("Nome atualizado!")) {
            window.location.reload();
          }
        } else {
          if (!alert("Ocorreu um erro. Tente de novo mais tarde.")) {
            window.location.reload();
          }
        }
      })
      .catch((error) => {
        console.error("ERROR: could not edit game!", error);
        window.alert("Ocorreu um erro. Tente de novo mais tarde.");
      });
  } else {
    window.alert(
      "Valor inválido! Não são aceitos valores nulos ou que contenham mais de 50 caracteres"
    );
  }
};

const removeGame = (gameEl) => {
  if (window.confirm("Você tem certeza que deseja excluir esse desafio?")) {
    deleteGame(gameEl.id)
      .then((response) => {
        if (response) {
          if (!alert("Desafio excluído!")) {
            window.location.reload();
          }
        } else {
          if (!alert("Ocorreu um erro. Tente de novo mais tarde.")) {
            window.location.reload();
          }
        }
      })
      .catch((error) => {
        console.error("ERROR: could delete game!", error);
        window.alert("Ocorreu um erro. Tente de novo mais tarde.");
      });
  }
};

const createGame = (name) => {
  postGame(name)
    .then((response) => {
      if (response) {
        if (!alert("Desafio criado com sucesso!")) {
          window.location.reload();
        }
      } else {
        if (!alert("Ocorreu um erro. Tente de novo mais tarde.")) {
          window.location.reload();
        }
      }
    })
    .catch((error) => {
      console.error("ERROR: could create game!", error);
      window.alert("Ocorreu um erro. Tente de novo mais tarde.");
    });
};

// EVENT LISTENERS

// get data fetched in headerInfo.js file
window.addEventListener("dataFetched", (event) => {
  gamesData = event.detail;
});

// create 'edit games' page
editGamesBtn.addEventListener("click", () => {
  changeElements();
  editGamesContainer.style.display = "flex";

  if (gamesData) {
    gameLists[0].innerHTML = "";
    gameLists[1].innerHTML = "";

    const lengthFirstList = gamesData.length - parseInt(gamesData.length / 2);

    let name;
    for (i = 0; i < lengthFirstList; i++) {
      name = gamesData[i].game_name;
      gameLists[0].innerHTML += `
        <div class="game__list__div" id=${gamesData[i].id}>
          <label>${name}</label>
          <input class="edit__game__input" placeholder='${name}' />
          
          <div class="edit__icons__div">
            <img class="edit__icon" src="/assets//img/edit-icon.png" />
            <img class="trash__icon" src="/assets//img/trash-icon.png" />
            
          </div>

          <div class="submit__icons__div">
            <img class="submit__edit__game" src="/assets//img/correct-icon.png" />
            <img class="cancel__edit__game" src="/assets//img/wrong-icon.png" />
          </div>
        </div>`;
    }

    for (i = 0; i < parseInt(gamesData.length / 2); i++) {
      name = gamesData[i + lengthFirstList].game_name;

      gameLists[1].innerHTML += `
        <div class="game__list__div" id=${gamesData[i + lengthFirstList].id}>
          <label>${name}</label>
        <input class="edit__game__input" placeholder='${name}' />
          
          <div class="edit__icons__div">
            <img class="edit__icon" src="/assets//img/edit-icon.png" />
            <img class="trash__icon" src="/assets//img/trash-icon.png" />
            
          </div>

          <div class="submit__icons__div">
            <img class="submit__edit__game" src="/assets//img/correct-icon.png" />
            <img class="cancel__edit__game" src="/assets//img/wrong-icon.png" />
          </div>
        </div>`;
    }

    // add listeners to icons

    // edit
    document.querySelectorAll(".edit__icon").forEach((el) => {
      el.addEventListener("click", () => {
        editGame(el.parentElement.parentElement);
      });
    });

    //delete
    document.querySelectorAll(".trash__icon").forEach((el) => {
      el.addEventListener("click", () => {
        removeGame(el.parentElement.parentElement);
      });
    });

    document.querySelectorAll(".submit__edit__game").forEach((el) => {
      el.addEventListener("click", () => {
        submitEditGame(el.parentElement.parentElement);
      });
    });
    document.querySelectorAll(".cancel__edit__game").forEach((el) => {
      el.addEventListener("click", () => {
        cancelEditGame(el.parentElement.parentElement);
      });
    });
  }
});

addGameBtn.addEventListener("click", () => {
  changeElements();
  addGameContainer.style.display = "flex";

  document.getElementById("create__game__btn").addEventListener("click", () => {
    createGame(document.getElementById("add__input").value);
  });
});

backBtn.addEventListener("click", () => {
  adminContainerBtns.style.display = "flex";
  backBtn.style.display = "none";
  editGamesContainer.style.display = "none";
  editChatContainer.style.display = "none";
  addGameContainer.style.display = "none";
});

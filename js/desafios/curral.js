// INIT EVENTS
const initEvents = () => {
  // handles the current element being dragged, adding and removing "dragging" class
  document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  });
  document.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
    removeCurrentItem(e.target.parentElement);
    if (checkEndGame()) endGame();
  });

  // selects element being dragged over the drop target (item__container) and appends it
  const containers = document.querySelectorAll(".item__container");
  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      const draggingItem = document.querySelector(".dragging");
      container.prepend(draggingItem);
    });
  });

  // move item to initial position when it is being dragged over the initial drop area
  const initialContainers = document.querySelectorAll(".botoes__container");
  initialContainers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      const draggingItem = document.querySelector(".dragging");

      moveToInitialPos(draggingItem);
    });
  });
};

// FUNCTIONS

// 1) DRAGGING ELEMENTS FUNCTIONS

// allows item to go back to its original position
const moveToInitialPos = (item) => {
  const itemClass = item.classList[1];
  const initialPos = document
    .querySelector("#botoes")
    .querySelector(`.${itemClass}`);
  initialPos.prepend(item);
};

// allows replace one item for another inside a drop target
const removeCurrentItem = (container) => {
  if (container.childNodes.length == 2) {
    const child = container.lastChild;
    moveToInitialPos(child);
  }
};

// 2) END GAME FUNCTIONS

// checks if all animal items were placed in a drop target, ends the game if so
const checkEndGame = () => {
  let result = true;
  document.querySelectorAll(".item__container").forEach((el) => {
    if (!el.hasChildNodes()) {
      result = false;
    }
  });
  return result;
};

// verifies if solution is correct or wrong
const checkSolution = () => {
  // check if every animal item was put in right position
  const containers = document.querySelectorAll(".item__container");

  // this array is the correct sequence of animals for the only correct solution
  const solution = ["boi", "cavalo", "porco", "boi", "cavalo", "porco", "boi"];

  // loop trough the spaces and checks if the sequence of animals is the same as the correct solution
  console.log(containers[0].firstChild);
  for (i = 0; i < 7; i++) {
    if (
      !containers[i].firstChild.className.split(" ")[1].startsWith(solution[i])
    )
      return false;
  }
  return true;
};

const endGame = () => {
  const containers = document.querySelectorAll(
    ".item__container, .fixed__item__container"
  );

  // create reset button
  const button = document.getElementById("tentar");
  // button.id = "tentar";
  button.addEventListener("click", () => resetGame());

  if (checkSolution()) {
    // set CORRECT style css
    containers.forEach((el) => (el.style.border = "6px solid green"));
    button.className = "correct";
    button.innerHTML = "Parabéns! Você descobriu!";
  } else {
    // set WRONG style css

    let i1, i2, i3; // itens in a row or column

    [".row1", ".row2", ".row3", ".col1", ".col2", ".col3"].forEach((el) => {
      let rowsOrCols = document.querySelectorAll(el);

      i1 = rowsOrCols[0].firstElementChild.className.split(" ")[1];
      i2 = rowsOrCols[1].firstElementChild.className.split(" ")[1];
      i3 = rowsOrCols[2].firstElementChild.className.split(" ")[1];

      if (i1 === i2) {
        rowsOrCols[0].style.border = "6px solid red";
        rowsOrCols[1].style.border = "6px solid red";

        if (i1 === i3) {
          rowsOrCols[2].style.border = "6px solid red";
        }
      } else if (i1 === i3) {
        rowsOrCols[0].style.border = "6px solid red";
        rowsOrCols[2].style.border = "6px solid red";
      } else if (i2 === i3) {
        rowsOrCols[1].style.border = "6px solid red";
        rowsOrCols[2].style.border = "6px solid red";
      }
    });

    button.className = "pulse";
    button.innerHTML = "Tente de novo!";
  }

  // insert reset button
  // document.querySelector("#botoes").append(button);
  button.style.display = "block";
};

// 3) RESET GAME
const resetGame = () => {
  document.querySelector(".curral__container").innerHTML = "";

  document.querySelector(".curral__container").innerHTML = `
    <div class="drop__targets">
      <div class="item__container row1 col1"></div>
      <div class="item__container row1 col2"></div>
      <div class="fixed__item__container row1 col3">
        <img
          class="fixed__item porco"
          draggable="false"
          src="/assets//img/porco.png"
        />
      </div>

      <div class="item__container row2 col1"></div>
      <div class="item__container row2 col2"></div>
      <div class="item__container row2 col3"></div>

      <div class="fixed__item__container row3 col1">
        <img
          class="fixed__item cavalo"
          draggable="false"
          src="/assets//img/cavalo.png"
        />
      </div>
      <div class="item__container row3 col2"></div>
      <div class="item__container row3 col3"></div>
    </div>

    <div id="botoes">
      <div class="botoes__container porco">
        <img
          class="curral__item porco"
          draggable="true"
          src="/assets//img/porco.png"
        />

        <img
          class="curral__item porco"
          draggable="true"
          src="/assets//img/porco.png"
        />
      </div>

      <div class="botoes__container cavalo">
        <img
          class="curral__item cavalo"
          draggable="true"
          src="/assets//img/cavalo.png"
        />

        <img
          class="curral__item cavalo"
          draggable="true"
          src="/assets//img/cavalo.png"
        />
      </div>

      <div class="botoes__container boi">
        <img
          class="curral__item boi"
          draggable="true"
          src="/assets//img/boi.png"
        />

        <img
          class="curral__item boi"
          draggable="true"
          src="/assets//img/boi.png"
        />

        <img
          class="curral__item boi"
          draggable="true"
          src="/assets//img/boi.png"
        />

        <button id="tentar" class="" style="display: none"></button>
      </div>
    </div>
  `;

  initEvents();
};

initEvents();

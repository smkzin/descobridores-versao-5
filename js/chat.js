// FUNCTIONS
const getActiveGameMessages = () => {};

const closeModal = () => {
  modal.style.display = "none";
  document.getElementById("desafios").style.opacity = "1";
  document.querySelector(".messages__wrap").style.opacity = "1";
};

const sendMessage = () => {
  const name = document.getElementById("user__name").value;
  const avatar = document.querySelector('input[name="avatar"]:checked').value;
  const message = document.getElementById("user__message").value;
  const dateStr = new Date();

  const avatarID = avatar.split("avatar")[1];

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message__container");
  messageDiv.classList.add("user__message");

  messageDiv.innerHTML = createMessageHTML(name, dateStr, avatarID, message);
  document.getElementById("messages").appendChild(messageDiv);

  // send to database
  game_id = parseInt(activeGame.split("-")[1]) + 1;
  const messageData = {
    username: name,
    date: formatDateToMySQL(),
    avatar_number: avatarID,
    message,
    is_admin: 0,
    game_id,
  };

  addMessage(messageData)
    .then(() => {
      window.location.href = `chatAdmin.html?desafio=${activeGame}`;
    })
    .catch((error) => console.error(error));
};

// set css accordingly with wich game is active
const setActiveGame = (gameId) => {
  document.getElementById(activeGame).classList.remove("active__game");

  const currentChat = document.getElementById("current__chat");
  let activeGameEl = document.getElementById(gameId);

  // set the focus on the current active game
  activeGameEl.focus();
  // Check if the child element is not fully visible
  const gamesContainer = document.querySelector(".desafios__container");
  const containerRect = gamesContainer.getBoundingClientRect();
  const activeGameRect = activeGameEl.getBoundingClientRect();
  if (
    activeGameRect.bottom > containerRect.bottom ||
    activeGameRect.top < containerRect.top
  ) {
    // Adjust the scroll position to bring the child element into view
    gamesContainer.scrollTop =
      activeGameEl.offsetTop - gamesContainer.offsetTop;
  }

  let color =
    activeGameEl.classList[0] == "game__selector"
      ? activeGameEl.classList[1]
      : activeGameEl.classList[0];

  activeGameEl.classList.add("active__game");
  currentChat.style.color = `var(--${color})`;

  currentChat.querySelector(
    "img"
  ).src = `/assets//img/Desafios-img/${gameId}.png`;

  document.querySelector(
    ".messages"
  ).style.backgroundImage = `url("/assets//img/Desafios-img/${gameId}.png")`;

  currentChat.querySelector("h5").innerHTML =
    activeGameEl.lastElementChild.innerHTML;

  activeGame = gameId;

  getMessages((parseInt(activeGame.split("-")[1]) + 1).toString());
};

// function to create the HTML structure for each message
const createMessageHTML = (name, dateStr, avatarID, message) => {
  const date = formatDate(dateStr);

  return `
    <div class="message__div">
      <img src="/assets//img/chat/avatar${avatarID}.jpg" alt="" />
      <p>
        ${message}
      </p>
    </div>
    <div class="info__message__div">
      <span>${name}</span>
      <span>${date}</span>
    </div>
  `;
};

// format data object to the website's format that is "hour:minutes dd/mm/yyyy"
const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  const padZero = (num) => (num < 10 ? "0" : "") + num;

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
};

// format the date accordingly to MySQL datetime type
const formatDateToMySQL = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// create HTML elements
const createHTML = (data) => {
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = "";
  data.forEach((message) => {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message__container");

    messageDiv.id = `msg__${message.id}`;

    if (message.is_admin) {
      messageDiv.classList.add("monitor__message");
    } else {
      messageDiv.classList.add("user__message");
    }
    messageDiv.innerHTML = createMessageHTML(
      message.username,
      message.date,
      message.avatar_number,
      message.message
    );
    messagesContainer.appendChild(messageDiv);
  });

  // dispatch custom event to inform that the html was created
  window.dispatchEvent(new CustomEvent("html-created"));
};

const getMessages = (game) => {
  if (!messagesData[game]) {
    fetchMessages(game)
      .then((data) => {
        // save data into a global variable
        messagesData[game] = data;
        createHTML(data);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  } else {
    createHTML(messagesData[game]);
  }
};

const displayGames = (data) => {
  const colors = [
    "red",
    "orange",
    "black",
    "green",
    "black",
    "green",
    "black",
    "pink",
    "green",
    "pink",
    "orange",
    "pink",
    "black",
    "blue",
    "dark__blue",
    "dark__blue",
    "green",
    "red",
    "red",
    "dark__blue",
  ];

  const container = document.querySelector(".desafios__container");
  container.innerHTML = "";

  let index = 0;
  data.forEach((el) => {
    const div = document.createElement("div");

    div.id = `chat-${el.id - 1}`;
    div.classList.add("game__selector");
    div.classList.add(colors[index]);
    index++;
    if (index > colors.length - 1) index = 0;

    div.innerHTML = `
      <img src="/assets//img/Desafios-img/chat-${el.id - 1}.png" />
      <label>${el.game_name}</label>
    `;

    container.appendChild(div);

    div.addEventListener("click", () => {
      setActiveGame(div.id);
    });
  });
};

const formValidation = () => {
  avatarField = document.querySelector(".avatar__container");
  nameField = document.getElementById("user__name");
  messageField = document.getElementById("user__message");

  // CLEAN form from invalid styles
  if (avatarField.classList.contains("invalid__field"))
    avatarField.classList.remove("invalid__field");

  if (nameField.classList.contains("invalid__field"))
    nameField.classList.remove("invalid__field");

  if (messageField.classList.contains("invalid__field"))
    messageField.classList.remove("invalid__field");

  // check CURRENT values
  let isAvatarNull = true;
  document.querySelectorAll('input[name="avatar"]').forEach((el) => {
    if (el.checked) isAvatarNull = false;
  });

  // check if any of the fields are empty
  if (isAvatarNull) {
    console.log("No avatar passed");
    avatarField.classList.add("invalid__field");
    return false;
  } else if (!nameField.value) {
    console.log("No name passed");
    nameField.classList.add("invalid__field");
    return false;
  } else if (!messageField.value) {
    console.log("No message passed");
    messageField.classList.add("invalid__field");
    return false;
  } else {
    //
    return true;
  }
};

// INIT variables
let messagesData = [];
const urlParams = new URLSearchParams(window.location.search);

let activeGame = urlParams.get("desafio") ? urlParams.get("desafio") : "chat-0";
setActiveGame(activeGame);

const games = document.querySelectorAll(".game__selector");
const form = document.getElementById("chat__form");
const modal = document.getElementById("msgSettings");

let gamesData;

// EVENT LISTENERS

// get data fetched in headerInfo.js file
window.addEventListener("dataFetched", (event) => {
  gamesData = event.detail;

  displayGames(gamesData);
});

// open and close modal popup with mensagem settings
document.getElementById("send__icon").addEventListener("click", () => {
  // make backgroung almost disappear
  document.getElementById("desafios").style.opacity = "0.1";
  document.querySelector(".messages__wrap").style.opacity = "0.1";

  // show modal
  modal.style.display = "block";

  // focus on modal
  modal.scrollIntoView({ behavior: "smooth" });

  document.getElementById("user__message").value = document.getElementById(
    "send__message__input"
  ).value;
});

// close the modal when the user clicks on cancel button
document.getElementById("cancel__message").addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

// message form event listener
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (formValidation()) {
      // reCaptcha VALIDATION
      const captchaResponse = grecaptcha.getResponse();

      if (!captchaResponse.length > 0) {
        document.querySelector(".g-recaptcha").classList.add("invalid__field");
        throw new Error("Captcha not complete");
      }
      sendMessage();
      closeModal();
    }
  });
}

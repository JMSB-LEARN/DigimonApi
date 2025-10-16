const form = document.querySelector("#searchForm");
const cardList = document.querySelector("#digimonList");

async function loadDigimons(name = "", limit = 10) {
  try {
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon?pageSize=${limit}&name=${name}`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const listaDigimons = (await respuesta.json()).content;
    console.log(listaDigimons);
    poblarPagina(listaDigimons);

  } catch (err) {
    console.error("Error al cargar Digimons:", err);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = form.querySelector("#name").value.trim();
  const limit = form.querySelector("#limit").value.trim();
  loadDigimons(name, limit);
});

function poblarPagina(listaDigimons) {
  cardList.innerHTML = "";

  // Create and append cards
  listaDigimons.forEach(digimon => {
    const carta = crearCarta(digimon);
    cardList.appendChild(carta);
  });
}

function crearCarta(digimon) {
  const contenedorCarta = document.createElement("div");
  contenedorCarta.classList.add("digimon-card");

  const imagenDigimon = document.createElement("img");
  imagenDigimon.setAttribute("src", digimon.image?digimon.image:"");
  imagenDigimon.setAttribute("alt", digimon.name);
  contenedorCarta.appendChild(imagenDigimon);

  const nombreDigimon = document.createElement("p");
  nombreDigimon.textContent = digimon.name;
  contenedorCarta.appendChild(nombreDigimon);

  return contenedorCarta;
}

loadDigimons();

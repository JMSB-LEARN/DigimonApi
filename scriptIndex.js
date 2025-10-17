const form = document.querySelector("#searchForm");
const cardList = document.querySelector("#digimonList");

async function loadDigimons(name = "", limit = 10, page = Math.floor(Math.random() * 20) + 1) {
  try {
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon?pageSize=${limit}&name=${name}&page=${page}`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const listaDigimons = (await respuesta.json()).content;
    await poblarPagina(listaDigimons);
  } catch (err) {
    console.error("Error al cargar Digimons:", err);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = form.querySelector("#name").value.trim();
  const limit = form.querySelector("#limit").value.trim();
  loadDigimons(name, limit, 1);
});

async function poblarPagina(listaDigimons) {
  cardList.innerHTML = "";
  const cartas = await Promise.all(listaDigimons.map(crearCarta));
  cartas.forEach(carta => cardList.appendChild(carta));
}

async function crearCarta(digimon) {
  try {
    const respuesta = await fetch(`https://digi-api.com/api/v1/digimon/${digimon.id}`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datosDigimon = await respuesta.json();
    const contenedorCarta = document.createElement("div");
    contenedorCarta.classList.add("digimon-card");
    const imagenDigimon = document.createElement("img");
    imagenDigimon.setAttribute("src", digimon.image || "");
    imagenDigimon.setAttribute("alt", digimon.name);
    contenedorCarta.appendChild(imagenDigimon);
    const nombreDigimon = document.createElement("p");
    nombreDigimon.textContent = "Nombre: " + datosDigimon.name;
    contenedorCarta.appendChild(nombreDigimon);
    const nivelDigimon = document.createElement("p");
    nivelDigimon.textContent = "Nivel: " + (datosDigimon.levels?.[0]?.level || "Desconocido");
    contenedorCarta.appendChild(nivelDigimon);
    contenedorCarta.addEventListener("click", () => {
      window.location.href = `details.html?id=${digimon.id}`;
    });
    return contenedorCarta;
  } catch (err) {
    console.error("Error al crear carta de Digimon:", err);
  }
}

loadDigimons();

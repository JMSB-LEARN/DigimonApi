const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadDigimonDetail() {
    if (!id) return;

    const container = document.querySelector("#digiInfo");
    container.textContent = 'Cargando...';

    try {
        const res = await fetch(`https://digi-api.com/api/v1/digimon/${id}`);
        const datosDigimon = await res.json();

        container.textContent = '';

        // Title
        const title = document.createElement('h1');
        title.textContent = datosDigimon.name;
        title.setAttribute('id', 'digimonName');

        // Image
        const img = document.createElement('img');
        img.setAttribute('src', datosDigimon.images?.[0]?.href || '');
        img.setAttribute('alt', datosDigimon.name);
        img.setAttribute('width', '150');
        img.setAttribute('height', '150');

        // Info list
        const info = document.createElement('ul');
        info.setAttribute('id', 'digimonInfo');

        const level = document.createElement('li');
        level.textContent = 'Nivel: ' + (datosDigimon.levels?.[0]?.level || 'Desconocido');

        const type = document.createElement('li');
        type.textContent = 'Tipo: ' + (datosDigimon.types?.[0]?.type || 'N/A');

        const attr = document.createElement('li');
        attr.textContent = 'Atributo: ' + (datosDigimon.attributes?.[0]?.attribute || 'N/A');

        const field = document.createElement('li');
        field.textContent = 'Campo: ' + (datosDigimon.fields?.[0]?.field || 'N/A');

        info.appendChild(level);
        info.appendChild(type);
        info.appendChild(attr);
        info.appendChild(field);

        // Evolution chain
        const evolutions = document.createElement('div');
        evolutions.setAttribute('id', 'evolutions');

        const priorContainer = createEvolution(datosDigimon.priorEvolutions, "Evoluciones Anteriores");
        const nextContainer = createEvolution(datosDigimon.nextEvolutions, "Siguientes Evoluciones");

        if (priorContainer) evolutions.appendChild(priorContainer);
        if (nextContainer) evolutions.appendChild(nextContainer);

        // Back button
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Volver';
        backBtn.setAttribute('type', 'button');
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Append everything
        container.appendChild(title);
        container.appendChild(img);
        container.appendChild(info);
        container.appendChild(evolutions);
        container.appendChild(backBtn);

    } catch (err) {
        container.textContent = 'Error al cargar el detalle.';
        console.error(err);
    }
}

// Returns a container with evolution buttons
function createEvolution(ramaEvolutiva, mensaje) {
    if (!ramaEvolutiva?.length) return null;

    const container = document.createElement('div');

    // Title
    const title = document.createElement('h3');
    title.textContent = mensaje;
    container.appendChild(title);

    // Cards container
    const cardsContainer = document.createElement('div');
    container.appendChild(cardsContainer);
    cardsContainer.classList.add("conenedorCartaEvolutiva")

    ramaEvolutiva.forEach(evo => {
        const card = document.createElement('div');
        card.classList.add("cartaEvolutiva")
        // Evolution image
        const img = document.createElement('img');
        img.setAttribute('src', evo.image || '');
        img.setAttribute('alt', evo.digimon);
        img.setAttribute('width', '100');
        img.setAttribute('height', '100');

        // Evolution name
        const name = document.createElement('p');
        name.textContent = evo.digimon;

        // Evolution ID
        const idText = document.createElement('p');
        idText.textContent = 'ID: ' + evo.id;

        // Append elements to card
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(idText);

        // Condition (optional)
        if (evo.condition) {
            const condition = document.createElement('p');
            condition.textContent = 'Condición: ' + evo.condition;
            card.appendChild(condition);
        }

        // Make card clickable
        card.addEventListener('click', () => {
            window.location.href = `details.html?id=${evo.id}`;
        });


        // Append card to cards container
        cardsContainer.appendChild(card);
    });

    return container;
}

loadDigimonDetail();

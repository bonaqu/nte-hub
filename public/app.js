let characters = [];

const grid =
    document.getElementById(
        "charactersGrid"
    );

async function loadCharacters(){

    const response =
        await fetch(
            "./data/characters.json"
        );

    characters =
        await response.json();

    renderCharacters(characters);
}

function renderCharacters(data){

    grid.innerHTML = "";

    data.forEach(character => {

        const card =
            document.createElement("div");

        card.className =
            "characterCard";

        card.innerHTML = `
      <h2>${character.name}</h2>

      <p>${character.tier}</p>

      <p>${character.role}</p>

      <p>${character.description}</p>
    `;

        card.onclick = () => {
            openCharacter(character);
        };

        grid.appendChild(card);
    });
}

function openCharacter(character){

    const modal =
        document.getElementById(
            "characterModal"
        );

    const body =
        document.getElementById(
            "modalBody"
        );

    body.innerHTML = `
    <h1>${character.name}</h1>

    <p>${character.description}</p>

    <h3>Teams</h3>

    ${
        character.teams
            ? character.teams.map(team => `
        <div>
          <h4>${team.name}</h4>

          <p>
            ${team.members.join(", ")}
          </p>
        </div>
      `).join("")
            : "<p>No teams</p>"
    }
  `;

    modal.classList.add("active");
}

function closeModal(){

    document
        .getElementById(
            "characterModal"
        )
        .classList
        .remove("active");
}

function toggleAdmin(){

    document
        .getElementById(
            "adminDrawer"
        )
        .classList
        .toggle("active");
}

function addCharacter(){

    const name =
        document
            .getElementById(
                "charName"
            )
            .value;

    const desc =
        document
            .getElementById(
                "charDesc"
            )
            .value;

    const newCharacter = {
        name,
        tier:"NEW",
        role:"Custom",
        description:desc
    };

    characters.push(newCharacter);

    renderCharacters(characters);
}

document
    .getElementById(
        "searchInput"
    )
    .addEventListener("input", e => {

        const value =
            e.target.value.toLowerCase();

        const filtered =
            characters.filter(character =>
                character.name
                    .toLowerCase()
                    .includes(value)
            );

        renderCharacters(filtered);
    });

loadCharacters();
const characters = [
    {
        name: "Hatori",
        tier: "S+",
        role: "Burst DPS",
        description:
            "Massive burst damage and extremely strong synergy."
    },

    {
        name: "Lacrimosa",
        tier: "S",
        role: "Chaos DPS",
        description:
            "Chaos reactions and DOT pressure."
    }
];

const root =
    document.getElementById("characters");

function renderCharacters(){

    root.innerHTML = "";

    characters.forEach(character => {

        const card =
            document.createElement("div");

        card.className =
            "characterCard";

        card.innerHTML = `
      <h2>${character.name}</h2>

      <p>${character.tier}</p>

      <p>${character.role}</p>

      <p>${character.description}</p>

      <button>
        Open Guide
      </button>
    `;

        root.appendChild(card);
    });
}

function toggleAdmin(){

    document
        .getElementById("adminDrawer")
        .classList
        .toggle("active");
}

function addCharacter(){

    const name =
        document.getElementById("charName").value;

    const desc =
        document.getElementById("charDesc").value;

    characters.push({
        name,
        tier:"NEW",
        role:"Custom",
        description:desc
    });

    renderCharacters();
}

renderCharacters();
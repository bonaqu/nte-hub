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
      <img
        class="characterImage"
        src="${character.image}"
      >

      <div class="tier">
        ${character.tier}
      </div>

      <h2>
        ${character.name}
      </h2>

      <p>
        ${character.role}
      </p>

      <div class="tags">
        ${
            character.tags
                .map(tag => `
            <span>${tag}</span>
          `)
                .join("")
        }
      </div>
    `;

        card.onclick = () => {
            openCharacter(character);
        };

        grid.appendChild(card);
    });
}

function markdownToHtml(markdown){

    return markdown
        .replace(/^# (.*$)/gim,"<h1>$1</h1>")
        .replace(/^## (.*$)/gim,"<h2>$1</h2>")
        .replace(/^### (.*$)/gim,"<h3>$1</h3>")
        .replace(/\n/g,"<br>");
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
    <div class="guideHero">

      <img
        class="guideSplash"
        src="${character.image}"
      >

      <div>

        <div class="tier">
          ${character.tier}
        </div>

        <h1>
          ${character.name}
        </h1>

        <p>
          ${character.description}
        </p>

      </div>

    </div>

    <div class="guideSection">

      <h2>
        Pros
      </h2>

      <ul>
        ${
        character.pros
            .map(pro => `
            <li>${pro}</li>
          `)
            .join("")
    }
      </ul>

    </div>

    <div class="guideSection">

      <h2>
        Cons
      </h2>

      <ul>
        ${
        character.cons
            .map(con => `
            <li>${con}</li>
          `)
            .join("")
    }
      </ul>

    </div>

    <div class="guideSection">

      <h2>
        Teams
      </h2>

      ${
        character.teams
            .map(team => `
          <div class="teamCard">

            <h3>
              ${team.name}
            </h3>

            <p>
              ${team.members.join(" • ")}
            </p>

            <p>
              ${team.description}
            </p>

          </div>
        `)
            .join("")
    }

    </div>

    <div class="guideMarkdown">
      ${markdownToHtml(character.guide)}
    </div>
  `;

    modal.classList.add("active");

    updateSEO(character);
}

function updateSEO(character){

    document.title =
        `${character.name} Build Guide | NTE HUB`;

    let meta =
        document.querySelector(
            'meta[name="description"]'
        );

    if(!meta){

        meta =
            document.createElement("meta");

        meta.name = "description";

        document.head.appendChild(meta);
    }

    meta.content =
        character.description;
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
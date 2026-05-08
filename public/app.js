let characters = [];

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

    const grid =
        document.getElementById(
            "charactersGrid"
        );

    if(!grid) return;

    grid.innerHTML = "";

    data.forEach(character => {

        const card =
            document.createElement("div");

        card.className =
            "characterCard";

        card.innerHTML = `

            <div class="imageWrapper">

                <img
                    class="characterImage"
                    src="${character.image}"
                >

                <div class="imageOverlay"></div>

            </div>

            <div class="cardContent">

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

            </div>
        `;

        card.onclick = () => {

            window.location.href =
                `./pages/character.html?id=${character.id}`;
        };

        grid.appendChild(card);
    });
}

async function loadCharacterPage(){

    const container =
        document.getElementById(
            "guidePage"
        );

    if(!container) return;

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");

    const response =
        await fetch(
            "../data/characters.json"
        );

    const data =
        await response.json();

    const character =
        data.find(c => c.id === id);

    if(!character){

        container.innerHTML =
            "<h1>Character not found</h1>";

        return;
    }

    document.title =
        `${character.name} Guide | NTE HUB`;

    container.innerHTML = `

        <section class="guideHeroSection">

            <div class="guideInfo">

                <div class="tier">
                    ${character.tier}
                </div>

                <h1>
                    ${character.name}
                </h1>

                <p>
                    ${character.description}
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

            </div>

            <img
                class="guideHeroImage"
                src="../${character.image}"
            >

        </section>

        <section class="guideGrid">

            <div class="guideBlock">

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

            <div class="guideBlock">

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

        </section>

        <section class="guideBlock">

            <h2>
                Best Teams
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

        </section>

        <section class="guideBlock markdownContent">

            ${markdownToHtml(character.guide)}

        </section>
    `;
}

function markdownToHtml(markdown){

    return markdown
        .replace(/^# (.*$)/gim,"<h1>$1</h1>")
        .replace(/^## (.*$)/gim,"<h2>$1</h2>")
        .replace(/^### (.*$)/gim,"<h3>$1</h3>")
        .replace(/\n/g,"<br>");
}

document
    .getElementById(
        "searchInput"
    )
    ?.addEventListener("input", e => {

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

loadCharacterPage();
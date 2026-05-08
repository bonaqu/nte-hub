let characters = [];

let currentTier = "all";
let currentRole = "all";
let currentAttribute = "all";

async function loadCharacters(){

    const response =
        await fetch("./characters.json");

    characters =
        await response.json();

    renderCharacters();
}

function renderCharacters(){

    const grid =
        document.getElementById(
            "charactersGrid"
        );

    grid.innerHTML = "";

    const filtered =
        characters.filter(character => {

            const tierMatch =
                currentTier === "all"
                || character.tier === currentTier;

            const roleMatch =
                currentRole === "all"
                || character.role === currentRole;

            const attributeMatch =
                currentAttribute === "all"
                || character.attribute === currentAttribute;

            return (
                tierMatch
                && roleMatch
                && attributeMatch
            );
        });

    filtered.forEach(character => {

        const card =
            document.createElement("div");

        card.className =
            "characterCard";

        card.innerHTML = `

            <img
                class="characterImage"
                src="${character.image}"
            >

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
                .map(tag =>
                    `<span>${tag}</span>`
                )
                .join("")
        }

                </div>

            </div>
        `;

        card.onclick = () => {
            openCharacter(character);
        };

        grid.appendChild(card);
    });
}

function openCharacter(character){

    const overlay =
        document.getElementById(
            "overlay"
        );

    const body =
        document.getElementById(
            "overlayBody"
        );

    body.innerHTML = `

        <div class="guideHero">

            <img src="${character.image}">

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

                <div class="tags">

                    ${
        character.tags
            .map(tag =>
                `<span>${tag}</span>`
            )
            .join("")
    }

                </div>

            </div>

        </div>

        <div class="guideSections">

            <div class="guideBlock">

                <h2>
                    Pros
                </h2>

                <ul>

                    ${
        character.pros
            .map(pro =>
                `<li>${pro}</li>`
            )
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
            .map(con =>
                `<li>${con}</li>`
            )
            .join("")
    }

                </ul>

            </div>

            <div class="guideBlock">

                <h2>
                    Best Teams
                </h2>

                ${
        character.teams
            .map(team => `

                            <div>

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

            <div class="guideBlock">

                <h2>
                    Build Priority
                </h2>

                <ol>

                    ${
        character.priority
            .map(skill =>
                `<li>${skill}</li>`
            )
            .join("")
    }

                </ol>

            </div>

        </div>

    `;

    overlay.classList.add("active");
}

function closeOverlay(){

    document
        .getElementById("overlay")
        .classList
        .remove("active");
}

function setTier(tier){

    currentTier = tier;

    renderCharacters();
}

function setRole(role){

    currentRole = role;

    renderCharacters();
}

function setAttribute(attribute){

    currentAttribute = attribute;

    renderCharacters();
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

        const grid =
            document.getElementById(
                "charactersGrid"
            );

        grid.innerHTML = "";

        filtered.forEach(character => {

            const card =
                document.createElement("div");

            card.className =
                "characterCard";

            card.innerHTML = `

                <img
                    class="characterImage"
                    src="${character.image}"
                >

                <div class="cardContent">

                    <div class="tier">
                        ${character.tier}
                    </div>

                    <h2>
                        ${character.name}
                    </h2>

                </div>
            `;

            card.onclick = () => {
                openCharacter(character);
            };

            grid.appendChild(card);
        });
    });

loadCharacters();
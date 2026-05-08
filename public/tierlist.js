let characters = [];

let currentRole = "all";

let currentAttribute = "all";

async function loadTierList(){

    const response =
        await fetch(
            "../data/characters.json"
        );

    characters =
        await response.json();

    renderTierList();
}

function renderTierList(){

    const container =
        document.getElementById(
            "tierContainer"
        );

    if(!container) return;

    container.innerHTML = "";

    const filtered =
        characters.filter(character => {

            const roleMatch =
                currentRole === "all"
                || character.role === currentRole;

            const attributeMatch =
                currentAttribute === "all"
                || character.attribute === currentAttribute;

            return roleMatch && attributeMatch;
        });

    const tiers = [
        "S+",
        "S",
        "A",
        "B"
    ];

    tiers.forEach(tier => {

        const tierCharacters =
            filtered.filter(character =>
                character.tier === tier
            );

        if(tierCharacters.length === 0)
            return;

        const section =
            document.createElement("div");

        section.className =
            "tierSection";

        section.innerHTML = `

            <div class="tierLabel">
                ${tier}
            </div>

            <div class="tierCharacters">

                ${
            tierCharacters
                .map(character => `

                            <div
                                class="tierCharacter"
                                onclick="
                                    window.location.href=
                                    './character.html?id=${character.id}'
                                "
                            >

                                <img
                                    src="../${character.image}"
                                >

                                <h3>
                                    ${character.name}
                                </h3>

                            </div>

                        `)
                .join("")
        }

            </div>
        `;

        container.appendChild(section);
    });
}

function filterRole(role){

    currentRole = role;

    renderTierList();
}

function filterAttribute(attribute){

    currentAttribute = attribute;

    renderTierList();
}

loadTierList();
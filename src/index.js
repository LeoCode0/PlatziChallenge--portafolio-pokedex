const pokemon_API = `${BASE_API}/pokemon`;
let currentPokemon;
let sprites = [];
let currentSprite = 0;
let listPokemons = "";

const fetchData = (API) => {
  return fetch(API)
    .then((res) => res.json())
    .then((data) => data);
};

const writeDescription = (API, node) => {
  fetchData(API).then((specie) => {
    node.textContent = specie.flavor_text_entries[0].flavor_text;
  });
};

const printPokemon = (pokemon) => {
  fetchData(`${pokemon_API}/${pokemon}`).then((data) => {
    if (sprites.length > 0) {
      sprites = [];
    }
    currentPokemon = data;
    console.log(currentPokemon);
    pokeImg.src = data.sprites.front_default;
    [pokePS, pokeDmg, pokeDef, pokeSpAtck, pokeSpDef, pokeSpeed].map(
      (node, index) => {
        node.style.width = `${data.stats[index].base_stat}%`;
        node.textContent = data.stats[index].base_stat;
      }
    );
    writeDescription(data.species.url, pokeDesc);
    const pokeSprites = currentPokemon.sprites;
    for (const key in pokeSprites) {
      if (typeof pokeSprites[key] === "string") {
        sprites.push(pokeSprites[key]);
      }
    }
  });
};

const printPokemons = (API) => {
  fetchData(API).then((pokemons) => {
    listPokemons = pokemons;
    pokemons.results.map((pokemon) => {
      const listItem = document.createElement("li");
      fetchData(pokemon.url).then((details) => {
        listItem.classList.add(details.types[0].type.name);
        listItem.innerHTML = `
          <img src=${details.sprites.front_default} alt=${details.name} >
          <div>
            <h3>${details.name}</h3>
            ${details.types.map((type) => `<span>${type.type.name}</span>`)}
            <p id=${details.name} ></p>
            <button onclick=printPokemon(${details.id}) >Show pokemon</button>
          </div>
        `;
        const detailsPok = document.querySelector(`#${details.name}`);
        writeDescription(details.species.url, detailsPok);
      });
      pokemonsList.appendChild(listItem);
    });
  });
};

const prevImg = () => {
  if (currentSprite === 0) {
    currentSprite = sprites.length - 1;
  } else {
    currentSprite--;
  }
  pokeImg.src = sprites[currentSprite];
};

const nextImg = () => {
  if (currentSprite === sprites.length - 1) {
    currentSprite = 0;
  } else {
    currentSprite++;
  }
  pokeImg.src = sprites[currentSprite];
};

const nextPokemon = () => {
  printPokemon(currentPokemon.id + 1);
};

const prevPokemon = () => {
  if (currentPokemon.id === 1) {
    currentPokemon.id = 200;
  }
  printPokemon(currentPokemon.id - 1);
};

const nextPokemons = () => {
  pokemonsList.innerHTML = "";
  fetchData(listPokemons.next).then((newData) => {
    printPokemons(newData.next);
  });
};

const prevPokemons = () => {
  pokemonsList.innerHTML = "";

  fetchData(listPokemons.next).then((newData) => {
    console.log(newData.previous);
    printPokemons(newData.previous);
  });
};

printPokemon(1);
printPokemons(`${BASE_API}/pokemon?limit=15&offset=0`);

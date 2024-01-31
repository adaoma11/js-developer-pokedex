
class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
}

class DetailedPokemon extends Pokemon {
    species;
    height;
    weight;
    abilities = [];
    gender = {};
    eggGroups = [];
    eggCycles;
    stats = [];
}
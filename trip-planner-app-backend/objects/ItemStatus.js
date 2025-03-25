class ItemStatus {
    #name;
    #color;

    constructor(name, color) {
        this.#name = name;
        this.#color = color;
    }

    getName(){
        return this.#name;
    }

    getColor(){
        return this.#color;
    }

    setName(name){
        this.#name = name;
    }

    setColor(color){
        this.#color = color;
    }

}

module.exports = ItemStatus;
import Model from './Model';


class Clothing extends Model {
    constructor(data) {
        super(data);
    }

    getColor() {
        return this.get('color');
    }

    getMaterial() {
        return this.get('material');
    }

    getWornAt() {
        return this.get('wornAt');
    }
}


export default Clothing;
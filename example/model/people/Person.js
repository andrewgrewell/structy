import Model from '../Model';


class Person extends Model {
    constructor(data) {
        super(data);
    }

    getName() {
        return this.get('name');
    }

    getStatus() {
        return this.get('status');
    }

    getLeftHandItem() {
        return this.get('leftHandItem');
    }

    getRightHandItem() {
        return this.get('rightHandItem');
    }
}


export default Person;
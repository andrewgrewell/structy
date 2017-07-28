import Person from './Person';


class SuperHero extends Person {
    constructor(data) {
        super(data);
    }

    getSuperPowers() {
        return this.get('superPowers');
    }

    setSuperPowers(superPowers) {
        return this.set('superPowers', superPowers);
    }

    addSuperPower(superPower) {
        return this.set('superPowers', this.superPowers.concat([superPower]));
    }

    removeSuperPower(type) {

    }

    hasSuperPower(type) {
        return this.superPowers.some(power => power.getType() === type);
    }

    canFly() {
        return this.hasSuperPower('flying');
    }

    hasLaserEyes() {
        return this.hasSuperPower('laserEyes');
    }
}


export default SuperHero;
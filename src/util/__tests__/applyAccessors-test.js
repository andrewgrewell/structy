import Model from '../../Model';
import applyAccessors from '../applyAccessors';

describe('Collection', () => {

    const testModelConfig = {
        foo: {
            default: 'foo value'
        },
        bar: {
            default: null
        }
    };
    class TestModel extends Model {
        constructor(data) {
            super(data, testModelConfig);
        }
    }

    applyAccessors(TestModel, { foo: null, bar: null });

    it('auto applies getters', () => {
        let testModel = new TestModel();
        expect(testModel.getFoo()).toEqual('foo value');
        expect(testModel.getBar()).toBeUndefined();
    });

    it('auto applies setters', () => {
        let testModel = new TestModel();
        expect(testModel.setFoo()).toBeInstanceOf(TestModel);
    });
});
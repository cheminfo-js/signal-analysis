import integration from '..';

describe('test myModule', () => {
    it('should return 42', () => {
        expect(integration()).toEqual(42);
    });
});

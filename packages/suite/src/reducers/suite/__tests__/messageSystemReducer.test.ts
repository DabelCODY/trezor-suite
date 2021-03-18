import messageSystemReducer, { State } from '../messageSystemReducer';
import { Action } from '@suite-types';
import fixtures, { timestamp } from '../__fixtures__/messageSystemReducer';

describe('Message system reducer', () => {
    fixtures.forEach(f => {
        beforeAll(() => {
            jest.spyOn(Date, 'now').mockImplementation(() => timestamp);
        });

        it(f.description, () => {
            let state: State = f.initialState as State;
            f.actions.forEach(a => {
                state = messageSystemReducer(state, a as Action);
            });
            expect(state).toEqual(f.result);
        });
    });
});

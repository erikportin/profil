import {getSearchFromUrl, isDiff, serverUserToClient} from "./data-handler";
import {IUserData, SUPPORTED_CLIENT} from "../typings/index";
import {randomAvatar} from "../ui/src/components/avatar-customizer/avatar-options";
import {CLIENT_ORIGINS} from "./client-handler";

describe('data-handler', function() {
    it('isDiff', function () {
        expect( isDiff(undefined, undefined)).toBeFalsy();
        expect( isDiff(null, undefined)).toBeFalsy();
        expect( isDiff({
            key: 1
        }, {
            key: 2
        })).toBeTruthy();
        expect( isDiff({
            key: 1
        }, {
            key: 1
        })).toBeFalsy();
    });
})

describe('serverUserToClient', function() {
    it('with no user', function () {
        const clientUser = serverUserToClient(undefined, SUPPORTED_CLIENT.SVT);
        expect(clientUser).toBeUndefined();
    });
    it('with no data', function () {
        const user = {
            id: '1',
            name: 'Name',
            avatar: randomAvatar(),
            clientsData: {},
            created: 1
        };
        const clientUser = serverUserToClient(user, SUPPORTED_CLIENT.SVT_BARN);
        const clientDataKeys = CLIENT_ORIGINS.find(({id}) => id === SUPPORTED_CLIENT.SVT_BARN).dataKeys;

        expect(clientUser.name).toMatch('Name');
        expect(clientUser.id).toMatch('1');
        expect(clientUser.avatar).toBeDefined();
        expect(clientUser.storageKeysWithData.length).toEqual(clientDataKeys.length);
        expect(clientUser.storageKeysWithData[0].data).toBeUndefined();
        expect(clientUser.ignoredKeysDiffCompare.length).toEqual(1)
        expect(clientUser.clients.length).toEqual(0);
    });
    it('with data', function () {
        const user = {
            id: '1',
            name: 'Name',
            avatar: randomAvatar(),
            clientsData: {
                [SUPPORTED_CLIENT.SVT]: [{
                    key: 'persistent_state',
                    data: 'some data'
                }]
            },
            created: 1
        };
        const clientUser = serverUserToClient(user, SUPPORTED_CLIENT.SVT);
        const clientDataKeys = CLIENT_ORIGINS.find(({id}) => id === SUPPORTED_CLIENT.SVT).dataKeys;

        expect(clientUser.name).toMatch('Name');
        expect(clientUser.id).toMatch('1');
        expect(clientUser.avatar).toBeDefined();
        expect(clientUser.storageKeysWithData.length).toEqual(clientDataKeys.length);
        expect(clientUser.storageKeysWithData[0].data).toMatch('some data');
        expect(clientUser.clients.length).toEqual(1);
        expect(clientUser.clients[0]).toMatch(SUPPORTED_CLIENT.SVT);
    });
})

describe('getSearchFromUrl', function() {
    it('with query', function () {
        const {href} = getSearchFromUrl("?href=" + encodeURIComponent('https://www.svtplay.se/video/25141886/rapport-fran-2050/rapport-fran-2050-boende?start=auto'));
        expect(href).toMatch('https://www.svtplay.se/video/25141886/rapport-fran-2050/rapport-fran-2050-boende?start=auto')
    });
})

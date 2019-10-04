
import expect from 'expect.js';
import { indexBy } from 'lodash';

import {
  bdd,
  esClient
} from '../../../support';

import PageObjects from '../../../support/page_objects';

bdd.describe('document level security', function describeIndexTests() {

  bdd.before(async function () {
    let response = await esClient.index('dlstest', 'dls', 'doc1', {
      "name" : "ABC Company",
      "region" : "EAST"
    });
    PageObjects.common.debug(response);
    expect(response._shards.successful).to.eql(1);

    response = await esClient.index('dlstest', 'dls', 'doc2', {
      "name" : "ABC Company",
      "region" : "WEST"
    });
    PageObjects.common.debug(response);
    expect(response._shards.successful).to.eql(1);

    await PageObjects.common.sleep(1000);
    await PageObjects.settings.navigateTo();
    await PageObjects.settings.clickKibanaIndicies();
    await PageObjects.settings.clickOptionalAddNewButton();
    await PageObjects.settings.setIndexPatternField('dlstest');
    await PageObjects.common.sleep(2000);
    await PageObjects.common.try(async () => {
      await PageObjects.settings.getCreateButton().click();
      await PageObjects.settings.clickDefaultIndexButton();
    });
    await PageObjects.settings.navigateTo();
    await PageObjects.security.clickElasticsearchRoles();
  });

  bdd.it('should add new role myroleEast', async function () {
    await PageObjects.security.addRole('myroleEast', {
      "indices": [{
        "names": [ "dlstest" ],
        "privileges": [ "read", "view_index_metadata" ],
        "query": "{\"match\": {\"region\": \"EAST\"}}"
      }]
    });
    await PageObjects.common.sleep(1000);
    const roles = indexBy(await PageObjects.security.getElasticsearchRoles(), 'rolename');
    PageObjects.common.debug('actualRoles = %j', roles);
    expect(roles).to.have.key('myroleEast');
    expect(roles.myroleEast.reserved).to.be(false);
    PageObjects.common.saveScreenshot('Security_Roles');
  });


  bdd.it('should add new user userEAST ', async function () {
    await PageObjects.settings.navigateTo();
    await PageObjects.security.clickElasticsearchUsers();
    await PageObjects.security.addUser({ username: 'userEast', password: 'changeme',
      confirmPassword: 'changeme', fullname: 'dls EAST', email: 'dlstest@elastic.com', save: true, roles: ['kibana_user', 'myroleEast'] });
    const users = indexBy(await PageObjects.security.getElasticsearchUsers(), 'username');
    PageObjects.common.debug('actualUsers = %j', users);
    expect(users.userEast.roles).to.eql(['kibana_user', 'myroleEast']);
  });

  bdd.it('user East should only see EAST doc', async function () {
    // await PageObjects.common.navigateToApp('discover');
    await PageObjects.shield.logoutLogin('userEast', 'changeme');
    // await PageObjects.common.navigateToApp('discover');
    await PageObjects.discover.selectIndexPattern('dlstest');
    await PageObjects.common.try(async () => {
      const hitCount = await PageObjects.discover.getHitCount();
      expect(hitCount).to.be('1');
    });
    const rowData = await PageObjects.discover.getDocTableIndex(1);
    expect(rowData).to.be('name:ABC Company region:EAST _id:doc1 _type:dls _index:dlstest _score:1');
  });

  bdd.after(async function () {
    await PageObjects.shield.logout();
  });


});

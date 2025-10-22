const AccRoles = require('../../../enums/access-roles.enum');
const getParamedicNav = require('../nav-access-roles/nav-paramedic');
const getChiefPhysicianNav = require('../nav-access-roles/nav-physician');

function getNavigationItems(type) {
  switch (type) {
    case AccRoles.PHYSICIAN:
      return getChiefPhysicianNav();
    case AccRoles.PARAMEDIC:
      return getParamedicNav();
    default:
      return [];
  }
}

module.exports = getNavigationItems;

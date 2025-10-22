const {
  PhysicianNavTitleEnum,
  PhysicianNavIconEnum,
  PhysicianNavRedirectToEnum,
  PhysicianNavDescriptionEnum
} = require("../nav-enums/nav-physician.enum")
const NavButton = require("../nav-enums/nav-button.enum")

function getChiefPhysicianNav() {
  return [
    { 
      [NavButton.BUTTON_TITLE]: PhysicianNavTitleEnum.PATIENTS, 
      [NavButton.ICON]: PhysicianNavIconEnum.PATIENTS, 
      [NavButton.REDIRECT_TO]: PhysicianNavRedirectToEnum.PATIENTS,
      [NavButton.DESCRIPTION]: PhysicianNavDescriptionEnum.PATIENTS },
    { 
      [NavButton.BUTTON_TITLE]: PhysicianNavTitleEnum.ATTENDANCE, 
      [NavButton.ICON]: PhysicianNavIconEnum.ATTENDANCE, 
      [NavButton.REDIRECT_TO]: PhysicianNavRedirectToEnum.ATTENDANCE,
      [NavButton.DESCRIPTION]: PhysicianNavDescriptionEnum.ATTENDANCE },
    { 
      [NavButton.BUTTON_TITLE]: PhysicianNavTitleEnum.PHOTOS, 
      [NavButton.ICON]: PhysicianNavIconEnum.PHOTOS, 
      [NavButton.REDIRECT_TO]: PhysicianNavRedirectToEnum.PHOTOS,
      [NavButton.DESCRIPTION]: PhysicianNavDescriptionEnum.PHOTOS }
  ];
}

module.exports = getChiefPhysicianNav;

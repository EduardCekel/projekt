const {
  ParamedicNavTitleEnum,
  ParamedicNavIconEnum,
  ParamedicNavRedirectToEnum,
  ParamedicNavDescriptionEnum
} = require("../nav-enums/nav-paramedic.enum")
const NavButton = require("../nav-enums/nav-button.enum")

function getParamedicNav() {
  return [
    { 
      [NavButton.BUTTON_TITLE]: ParamedicNavTitleEnum.VEHICLE, 
      [NavButton.ICON]: ParamedicNavIconEnum.VEHICLE, 
      [NavButton.REDIRECT_TO]: ParamedicNavRedirectToEnum.VEHICLE,
      [NavButton.DESCRIPTION]: ParamedicNavDescriptionEnum.VEHICLE 
    },
    { 
      [NavButton.BUTTON_TITLE]: ParamedicNavTitleEnum.PLANNED_DEPARTURES, 
      [NavButton.ICON]: ParamedicNavIconEnum.PLANNED_DEPARTURES, 
      [NavButton.REDIRECT_TO]: ParamedicNavRedirectToEnum.PLANNED_DEPARTURES,
      [NavButton.DESCRIPTION]: ParamedicNavDescriptionEnum.PLANNED_DEPARTURES 
    },
    { 
      [NavButton.BUTTON_TITLE]: ParamedicNavTitleEnum.DEPARTURES, 
      [NavButton.ICON]: ParamedicNavIconEnum.DEPARTURES, 
      [NavButton.REDIRECT_TO]: ParamedicNavRedirectToEnum.DEPARTURES,
      [NavButton.DESCRIPTION]: ParamedicNavDescriptionEnum.DEPARTURES 
    },
    { 
      [NavButton.BUTTON_TITLE]: ParamedicNavTitleEnum.VEHICLE_SERVICE, 
      [NavButton.ICON]: ParamedicNavIconEnum.VEHICLE_SERVICE, 
      [NavButton.REDIRECT_TO]: ParamedicNavRedirectToEnum.VEHICLE_SERVICE,
      [NavButton.DESCRIPTION]: ParamedicNavDescriptionEnum.VEHICLE_SERVICE 
    },
    { 
      [NavButton.BUTTON_TITLE]: ParamedicNavTitleEnum.RZP, 
      [NavButton.ICON]: ParamedicNavIconEnum.RZP, 
      [NavButton.REDIRECT_TO]: ParamedicNavRedirectToEnum.RZP,
      [NavButton.DESCRIPTION]: ParamedicNavDescriptionEnum.RZP },
  ];
}

module.exports = getParamedicNav;

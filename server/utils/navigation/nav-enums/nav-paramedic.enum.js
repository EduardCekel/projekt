const ParamedicNavTitleEnum = Object.freeze({
  VEHICLE: 'Vozidlá',
  PLANNED_DEPARTURES: 'Plánované výjazdy',
  DEPARTURES: 'Výjazdy',
  VEHICLE_SERVICE: 'Servis vozidiel',
  RZP: 'RZP',
});

const ParamedicNavIconEnum = Object.freeze({
  VEHICLE: 'directions_car',
  PLANNED_DEPARTURES: 'departure_board',
  DEPARTURES: 'directions_bus',
  VEHICLE_SERVICE: 'build',
  RZP: 'local_hospital'
});

const ParamedicNavRedirectToEnum = Object.freeze({
  VEHICLE: 'vehicles',
  PLANNED_DEPARTURES: 'planned-departures',
  DEPARTURES: 'departures',
  VEHICLE_SERVICE: 'dashboard',
  RZP: 'rzp',
});

const ParamedicNavDescriptionEnum = Object.freeze({
  VEHICLE: 'Prehľad všetkých záchranárských vozidiel',
  PLANNED_DEPARTURES: 'Plánované výjadzy, ktoré nemajú priradené vozidlo',
  DEPARTURES: 'Prehľad aktuálnych výjazdy kontrétnych vozidiel',
  VEHICLE_SERVICE: 'Prehľad servisovania vozidiel a kontroly STK',
  RZP: 'Rýchla zdravotná pomoc',
});

module.exports = {
  ParamedicNavTitleEnum,
  ParamedicNavIconEnum,
  ParamedicNavRedirectToEnum,
  ParamedicNavDescriptionEnum
};

const SuccessMsg = Object.freeze({
  VEHICLE_CREATED: 'Vozidlo úspešne vytvorené',
  VEHICLE_UPDATED: 'Vozidlo úspešne upravené',
  VEHICLE_DELETED: 'Vozidlo/á úspešne zmazané',

  DEPARTURE_CREATED: 'Výjazd úspešne naplánovaný',
  DEPARTURE_UPDATED: 'Výjazd úspešne upravený',
  DEPARTURE_DELETED: 'Výjazd úspešne zmazaný',
  DEPARTURE_VEHICLE_ASSIGNED: 'Vozidlo úspešne priradené',
  DEPARTURE_VEHICLE_CHANGED: 'Vozidlo úspešne zemenené',
  DEPARTURE_DURATION_CHANGED: 'Dĺžka výjazdu úspešne zmenená',
});

const DefaultMsg = Object.freeze({
  DEFAULT_MSG: ''
})

module.exports = {
  SuccessMsg,
  DefaultMsg
};
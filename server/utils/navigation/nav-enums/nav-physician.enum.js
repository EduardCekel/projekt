const PhysicianNavTitleEnum = Object.freeze({
  PATIENTS: 'Pacienti',
  ATTENDANCE: 'Dochádzka',
  PHOTOS: 'Snímky',
});

const PhysicianNavIconEnum = Object.freeze({
  PATIENTS: 'assignment_ind',
  ATTENDANCE: 'date_range',
  PHOTOS: 'camera_enhance',
});

const PhysicianNavRedirectToEnum = Object.freeze({
  PATIENTS: 'patients',
  ATTENDANCE: 'attendance',
  PHOTOS: 'photos',
});

const PhysicianNavDescriptionEnum = Object.freeze({
  PATIENTS: 'Prehľad všetkých pacientov doktora',
  ATTENDANCE: 'Dochádzka všetkých zamestnancov nemocnice',
  PHOTOS: 'Zväčšovanie nahratých snímok RTG',
});

module.exports = {
  PhysicianNavTitleEnum,
  PhysicianNavIconEnum,
  PhysicianNavRedirectToEnum,
  PhysicianNavDescriptionEnum
};

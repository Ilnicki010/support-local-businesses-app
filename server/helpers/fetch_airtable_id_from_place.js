module.exports = function fetchIdFromPlaceId(place_id,airtable_records) {
  return new Promise(function (resolve, reject) {
    for (record of records) {
      if (record.place_id == place_id) {
        resolve(record.id);
        return;
      }
    }
    reject("Record not found");
  });
}
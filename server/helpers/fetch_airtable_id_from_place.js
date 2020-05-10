module.exports = function(base,constants,place_id) {
  return new Promise(function (resolve, reject) {
    record_data = [];
    base(constants.recordTableName)
      .select({
        fields: ["id", "google_places_id"],
        filterByFormula: `{google_places_id} = '${place_id}'`
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function (record) {
            record_data.push({
              id: record.id,
              place_id: record.get("google_places_id"),
            });
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(error) {
          if (error) {
            reject(`Error fetching IDs for the google_places_id ${place_id}`);
            return;
          }
          if(record_data.length == 0) {
          	reject(`No data with the matching google_places_id ${place_id} found`);
          	return;
          }
          if(record_data.length > 1) {
          	reject(`Multiple entries for the same google_places_id ${place_id} found`);
          	return;
          }
          resolve(record_data[0].id);
          return;
        }
      );
  });
}
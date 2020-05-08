function updateRecordToIsVerified(id,constants,base) {
  const updateJson = {
    id,
    fields: {
      is_verified: true,
    },
  };

  return base(constants.recordTableName).update([updateJson]);
}
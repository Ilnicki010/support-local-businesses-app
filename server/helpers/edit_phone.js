module.exports = function (phone_number) {
  let new_phone = "";
  for (const char of phone_number) {
    const x = char - "0";
    if (isNaN(x)) continue;
    if (char == " ") continue;

    new_phone += x;
  }
  return new_phone;
}

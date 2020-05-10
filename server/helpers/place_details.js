module.exports = function(url,https) {
  return new Promise(function (resolve, reject) {
    https
      .get(url, (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (err) => {
        reject(err.message);
      });
  });
}
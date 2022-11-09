exports.fieldsQuery = (args) => {
  return JSON.parse(JSON.stringify(args));
};

exports.queryObjectBuilder = (value, keys, isSearch, toObject) => {
  return value
    ? toObject
      ? Array.from(keys, (f) => {
          return this.flatSubquery(
            f,
            isSearch
              ? {
                  $regex: value,
                  $options: "i",
                }
              : value
          );
        }).reduce((obj, e) => {
          return { ...obj, ...e };
        }, {})
      : Array.from(keys, (f) => {
          return this.flatSubquery(
            f,
            isSearch
              ? {
                  $regex: value,
                  $options: "i",
                }
              : value
          );
        })
    : obj
    ? {}
    : [];
};

exports.flatSubquery = (path, value) => {
  return typeof path === "string"
    ? this.flatSubquery(path.split("."), value)
    : typeof path === "object"
    ? path.length === 1
      ? {
          [path[0]]: value,
        }
      : {
          [path.shift()]: {
            $subquery: this.flatSubquery(path, value),
          },
        }
    : {};
};


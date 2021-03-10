const renameKey = (object, key, key2, key3, key4, newKey) => {
  const clone = (obj) => Object.assign({}, obj);
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  const targetKey2 = clonedObj[key2];
  const targetKey3 = clonedObj[key3];
  const targetKey4 = clonedObj[key4];
  delete clonedObj[key];
  delete clonedObj[key2];
  delete clonedObj[key3];
  delete clonedObj[key4];
  clonedObj[newKey] = targetKey + " - " + targetKey2 + " - " + targetKey3 + " - " + targetKey4;
  return clonedObj;
};
export default renameKey;

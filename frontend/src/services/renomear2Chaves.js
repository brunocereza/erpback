const renameKey = (object, key, key2, newKey) => {
  const clone = (obj) => Object.assign({}, obj);
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  const targetKey2 = clonedObj[key2];
  delete clonedObj[key];
  delete clonedObj[key2];
  clonedObj[newKey] = targetKey + " - " + targetKey2;
  return clonedObj;
};
export default renameKey;

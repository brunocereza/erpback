const renameKey = (object, key, key2, key3, newKey, limitador) => {
  const clone = (obj) => Object.assign({}, obj);
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  const targetKey2 = clonedObj[key2];
  const targetKey3 = clonedObj[key3];
  delete clonedObj[key];
  delete clonedObj[key2];
  delete clonedObj[key3];
  clonedObj[newKey] = targetKey + limitador + targetKey2 + limitador + targetKey3;
  return clonedObj;
};
export default renameKey;

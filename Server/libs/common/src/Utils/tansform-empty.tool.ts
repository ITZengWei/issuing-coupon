// 转移空对象
export const transformEmptyObj = (origin) => {
  for (let prop in origin) {
    if (typeof origin[prop] === 'undefined') {
      delete origin[prop]
    }
  }
  return origin
}
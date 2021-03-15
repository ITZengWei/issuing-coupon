const parse = <T>(data: any): T | null => {
  try {
    return JSON.parse(data) as T
  } catch (e) {
    return null
  }
}

interface ILocalStorage {
  setValue: (key: string, data: any) => ILocalStorage

  getValue: <T>(key: string) => T | null

  removeValue: (key: string) => ILocalStorage
}

const LocalStorage: ILocalStorage = {
  setValue(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data))

    return this
  },
  getValue<T>(key: string) {
    return parse<T>(key)
  },
  removeValue(key: string) {
    window.localStorage.removeItem(key)

    return this
  },
}

export default LocalStorage

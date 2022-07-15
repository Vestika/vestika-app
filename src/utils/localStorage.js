class localStorageManager {
  set(key, data) {
    if (data == null) {
      this.delete(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  delete(key) {
    localStorage.removeItem(key);
  }

  has(key) {
    return localStorage.getItem(key) != null;
  }

  clear() {
    localStorage.clear();
  }
}

module.exports = new localStorageManager();

class localStorageManager {
  set(key, data) {
    if (data == null) {
      this.delete(key);
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      console.error("Could not set data for key:", key);
    }
  }

  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      console.error("Could not parse data for key:", key);
    }
  }

  update_dict(key, data) {
    if (!this.has(key)) {
      this.set(key, data);
      return data;
    }
    const updated_dict = { ...this.get(key), ...data };
    this.set(key, updated_dict);
    return updated_dict;
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

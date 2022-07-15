export const store = {
  state: {
    isAnonymous: undefined,
  },

  setAnonymousState(newValue) {
    this.state.isAnonymous = newValue;
  },

  clearAnonymousState() {
    this.state.isAnonymous = undefined;
  },
};

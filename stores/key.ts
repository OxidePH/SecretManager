import { defineStore } from 'pinia';

export const useKeyStore = defineStore('key', {
  state: () => ({
    dataKey: ''
  }),
  actions: {
    setDataKey(key: string) {
      this.dataKey = key;
    }
  }
});

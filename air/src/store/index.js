import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roomStatus: {}
  },
  mutations: {
    setRoomStatus(state, { roomId, status }) {
      Vue.set(state.roomStatus, roomId, status)
    }
  },
  actions: {
    async fetchRoomStatus({ commit }, roomId) {
      const response = await this.$axios.get(`/api/room/${roomId}/status`)
      commit('setRoomStatus', { roomId, status: response.data })
    }
  }
})

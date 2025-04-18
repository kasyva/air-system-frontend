<template>
  <div>
    <h3>Room AC Control</h3>
    <p>Current Temperature: {{ currentTemp }}°C</p>
    <p>Target Temperature: {{ targetTemp }}°C</p>

    <!-- Control Buttons -->
    <button @click="startAC">Start AC</button>
    <button @click="stopAC">Stop AC</button>
    <button @click="setTemp(22)">Set Temp to 22°C</button>
    <button @click="setSpeed('high')">High Speed</button>
    <button @click="setSpeed('medium')">Medium Speed</button>
    <button @click="setSpeed('low')">Low Speed</button>

    <p>AC Status: {{ acStatus }}</p>
  </div>
</template>

<script>
export default {
  props: {
    roomId: Number
  },
  data() {
    return {
      currentTemp: 25,
      targetTemp: 25,
      acStatus: 'Off'
    }
  },
  methods: {
    async startAC() {
      await this.$axios.post(`/api/room/${this.roomId}/ac/start`);
      this.acStatus = 'On';
    },
    async stopAC() {
      await this.$axios.post(`/api/room/${this.roomId}/ac/stop`);
      this.acStatus = 'Off';
    },
    async setTemp(temp) {
      this.targetTemp = temp;
      await this.$axios.post(`/api/room/${this.roomId}/ac/set-temp`, { temp });
    },
    async setSpeed(speed) {
      await this.$axios.post(`/api/room/${this.roomId}/ac/set-speed`, { speed });
    }
  }
}
</script>

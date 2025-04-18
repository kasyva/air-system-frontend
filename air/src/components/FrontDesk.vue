<template>
  <div>
    <h3>Front Desk Operations</h3>
    <button @click="checkIn">Check In</button>
    <button @click="checkOut">Check Out</button>
    <p>Room Assignment: {{ assignedRoom }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assignedRoom: null
    }
  },
  methods: {
    async checkIn() {
      const response = await this.$axios.post('/api/checkin');
      this.assignedRoom = response.data.roomId;
    },
    async checkOut() {
      const response = await this.$axios.get(`/api/room/${this.assignedRoom}/billing`);
      console.log('Billing Info:', response.data);
    }
  }
}
</script>

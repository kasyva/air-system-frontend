<template>
  <div>
    <h3>Manager Report</h3>
    <label for="start">Start Date: </label>
    <input type="date" v-model="startDate" />
    <label for="end">End Date: </label>
    <input type="date" v-model="endDate" />
    <button @click="generateReport">Generate Report</button>

    <div v-if="reportData">
      <h4>Report Summary</h4>
      <pre>{{ reportData }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      reportData: null
    }
  },
  methods: {
    async generateReport() {
      const response = await this.$axios.get(`/api/manager/report?start=${this.startDate}&end=${this.endDate}`);
      this.reportData = response.data;
    }
  }
}
</script>

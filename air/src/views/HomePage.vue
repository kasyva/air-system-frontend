<template>
  <div>
    <h1>Hotel Management System</h1>

    <ACControl :roomId="101" />
    <FrontDesk />
    <ManagerReport />
  </div>
</template>

<script>
import ACControl from '../components/ACControl.vue'
import FrontDesk from '../components/FrontDesk.vue'
import ManagerReport from '../components/ManagerReport.vue'

export default {
  components: {
    ACControl,
    FrontDesk,
    ManagerReport
  }
}
</script>

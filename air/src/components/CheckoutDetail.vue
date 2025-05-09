<template>
  <div class="checkout-detail">
    <!-- 顾客入住信息 -->
    <el-card class="customer-info-card" v-if="localSelectedRoom">
      <template #header>
        <span class="card-header">顾客入住信息</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <p><strong>房间号：</strong>{{ checkInInfo.roomNumber }}</p>
        </el-col>
        <el-col :span="8">
          <p><strong>入住时间：</strong>{{ formattedCheckInTime }}</p>
        </el-col>
        <el-col :span="8">
          <p><strong>退房时间：</strong>{{ checkInInfo.checkOutTime }}</p>
        </el-col>
      </el-row>
    </el-card>

    <!-- 账单和详单 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 账单 -->
      <el-col :span="12">
        <el-card class="bill-card shadow-hover">
          <template #header>
            <span class="card-header">账单</span>
          </template>

          <!-- Loading 状态 -->
          <el-skeleton :loading="loading" animated>
            <el-form label-width="90px" label-position="left">
              <el-form-item label="住宿费">{{ billInfo.accommodationFee || '待计算' }}</el-form-item>
              <el-form-item label="空调费">{{ billInfo.airConditioningFee || '待计算' }}</el-form-item>
              <el-form-item label="总费用">
                <span style="color: #f56c6c; font-weight: bold;">{{ billInfo.totalFee || '待计算' }}</span>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="printBill" size="small" icon="document">打印账单</el-button>
          </el-skeleton>
        </el-card>
      </el-col>

      <!-- 详单 -->
      <el-col :span="12">
        <el-card class="details-card shadow-hover">
          <template #header>
            <span class="card-header">详单</span>
          </template>

          <!-- Loading 状态 -->
          <el-skeleton :loading="loading" animated>
            <div v-for="(item, index) in detailsInfo" :key="index" class="detail-item">
              <h4>{{ item.title }}</h4>
              <el-row :gutter="10">
                <el-col :span="8"><span>时长：{{ item.usageDuration }}</span></el-col>
                <el-col :span="8"><span>时段：{{ item.usagePeriod }}</span></el-col>
                <el-col :span="8"><span>费用：{{ item.totalCost }}</span></el-col>
              </el-row>
            </div>
            <el-divider />
            <p class="total-cost"><strong>详单总费用：</strong>{{ detailsTotalFee }}</p>
            <el-button type="info" @click="printDetails" size="small" icon="document">打印详单</el-button>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部按钮 -->
    <el-button
      type="success"
      @click="handleConfirm"
      :disabled="!localSelectedRoom || loading"
      style="margin-top: 20px; width: 100%; font-size: 16px;"
    >
      确认退房
    </el-button>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { checkout, fetchBillAndDetails } from '@/mockData.js';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

export default {
  name: 'CheckoutDetail',
  props: {
    selectedRoom: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'confirmCheckout'],
  setup(props, { emit }) {
    const localSelectedRoom = ref(null);
    const billInfo = ref({});
    const detailsInfo = ref([]);
    const detailsTotalFee = ref('');
    const loading = ref(false);

    // 当selectedRoom变化时，调用fetchBillAndDetails来加载账单和详单数据
    watch(
      () => props.selectedRoom,
      async (newVal) => {
        if (newVal) {
          localSelectedRoom.value = { ...newVal }; // 深拷贝避免修改原始数据
          loading.value = true;

          try {
            const response = await fetchBillAndDetails({ roomId: localSelectedRoom.value.roomId });
            billInfo.value = response.billInfo;
            detailsInfo.value = response.detailsInfo;
            detailsTotalFee.value = response.detailsTotalFee;
          } catch (error) {
            console.error("获取账单信息失败:", error);
          } finally {
            loading.value = false;
          }
        } else {
          localSelectedRoom.value = null;
        }
      },
      { immediate: true, deep: true }
    );

    // 使用 localSelectedRoom 而不是 props.selectedRoom
    const checkInInfo = computed(() => {
      if (!localSelectedRoom.value) return {};
      return {
        roomNumber: localSelectedRoom.value.roomId,
        checkInTime: localSelectedRoom.value.checkInTime,
        checkOutTime: formatTime(new Date())
      };
    });

    // 格式化入住时间
    const formattedCheckInTime = computed(() => {
      if (!checkInInfo.value.checkInTime) return '';
      const date = new Date(checkInInfo.value.checkInTime);
      return formatTime(date);
    });

    function formatTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const handleConfirm = async () => {
      if (!localSelectedRoom.value) {
        console.error("Selected room is not set");
        return;
      }

      try {
        loading.value = true;
        const response = await checkout({ roomId: localSelectedRoom.value.roomId });
        billInfo.value = response.billInfo;
        detailsInfo.value = response.detailsInfo;
        detailsTotalFee.value = response.detailsTotalFee;

        emit('confirmCheckout', localSelectedRoom.value.roomId);

      } catch (error) {
        console.error("退房失败:", error);
      } finally {
        loading.value = false;
      }
    };

    const printBill = () => {
      const element = document.querySelector('.bill-card');
      if (element) {
        html2canvas(element).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgProps= pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save("bill.pdf");
        });
      }
    };

    const printDetails = () => {
      const element = document.querySelector('.details-card');
      if (element) {
        html2canvas(element).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgProps= pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save("details.pdf");
        });
      }
    };

    return {
      checkInInfo,
      formattedCheckInTime,
      billInfo,
      detailsInfo,
      detailsTotalFee,
      handleConfirm,
      printBill,
      printDetails,
      localSelectedRoom,
      loading
    };
  }
};
</script>

<style scoped>
.checkout-detail {
  padding: 30px;
  background-color: #f9f9f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.customer-info-card,
.bill-card,
.details-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.card-header {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.el-form-item__label {
  font-weight: 500;
  color: #555;
}

.detail-item h4 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #444;
}

.detail-item span {
  display: block;
  font-size: 14px;
  color: #666;
}

.total-cost {
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
  margin-top: 10px;
}

.el-button {
  margin-top: 20px;
}

/* 打印按钮小图标风格 */
.el-button--primary.is-plain {
  background-color: #ecf5ff;
  color: #1a73e8;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-col {
    margin-bottom: 20px;
  }

  .el-col:last-child {
    margin-bottom: 0;
  }
}
</style>
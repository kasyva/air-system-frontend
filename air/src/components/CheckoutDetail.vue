<template>
  <div class="checkout-detail">
    <!-- 顾客入住信息 -->
    <el-card class="customer-info-card" v-if="billingInfo.roomId">
      <template #header>
        <span class="card-header">顾客入住信息</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <p><strong>房间号：</strong>{{ billingInfo.roomId }}</p>
        </el-col>
        <el-col :span="8">
          <p><strong>入住时间：</strong>{{ billingInfo.checkInTime }}</p>
        </el-col>
        <el-col :span="8">
          <p><strong>退房时间：</strong>{{ billingInfo.checkOutTime || '未退房' }}</p>
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
          <el-skeleton :loading="loadingBill || loading" animated>
            <el-form label-width="90px" label-position="left">
              <el-form-item label="住宿费">
                {{ formatCurrency(billingInfo.stayCost) }}
              </el-form-item>
              <el-form-item label="空调费">
                {{ formatCurrency(billingInfo.acCost) }}
              </el-form-item>
              <el-form-item label="总费用">
                <span style="color: #f56c6c; font-weight: bold;">
                  {{ formatCurrency(billingInfo.totalCost) }}
                </span>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="printBill" size="small" icon="document">
              打印账单
            </el-button>
          </el-skeleton>
        </el-card>
      </el-col>

      <!-- 详单 -->
      <el-col :span="12">
        <el-card class="details-card shadow-hover">
          <template #header>
            <span class="card-header">详单</span>
          </template>
          <el-skeleton :loading="loadingDetail || loading" animated>
            <!-- 低风 -->
            <div class="detail-item">
              <h4>低风 ({{ billingDetail.lowDuration || 0 }} 分钟)</h4>
              <el-row :gutter="10">
                <el-col :span="8">
                  <span>时段：{{ billingDetail.lowPeriods?.join(' / ') || '-' }}</span>
                </el-col>
                <el-col :span="8">
                  <span>费用：{{ formatCurrency(billingDetail.lowCost) }}</span>
                </el-col>
              </el-row>
            </div>

            <!-- 中风 -->
            <div class="detail-item">
              <h4>中风 ({{ billingDetail.mediumDuration || 0 }} 分钟)</h4>
              <el-row :gutter="10">
                <el-col :span="8">
                  <span>时段：{{ billingDetail.mediumPeriods?.join(' / ') || '-' }}</span>
                </el-col>
                <el-col :span="8">
                  <span>费用：{{ formatCurrency(billingDetail.mediumCost) }}</span>
                </el-col>
              </el-row>
            </div>

            <!-- 高风 -->
            <div class="detail-item">
              <h4>高风 ({{ billingDetail.highDuration || 0 }} 分钟)</h4>
              <el-row :gutter="10">
                <el-col :span="8">
                  <span>时段：{{ billingDetail.highPeriods?.join(' / ') || '-' }}</span>
                </el-col>
                <el-col :span="8">
                  <span>费用：{{ formatCurrency(billingDetail.highCost) }}</span>
                </el-col>
              </el-row>
            </div>

            <el-divider />
            <p class="total-cost">
              <strong>详单总费用：</strong>
              {{ formatCurrency(billingDetail.totalCost) }}
            </p>
            <el-button type="info" @click="printDetails" size="small" icon="document">
              打印详单
            </el-button>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部按钮 -->
    <el-button
      type="success"
      @click="handleConfirm"
      :disabled="!billingInfo.roomId || loading"
      style="margin-top: 20px; width: 100%; font-size: 16px;"
    >
      确认退房
    </el-button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import axios from 'axios';
import { ElMessage } from "element-plus";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

// 本地模拟数据（可根据需求自定义）
const mockBillingData = (roomId) => ({
  roomId,
  checkInTime: "2025-05-25 14:00",
  checkOutTime: "2025-05-25 16:30",
  stayCost: 150, // 住宿费（元）
  acCost: 25.5, // 空调费（元）
  totalCost: 175.5 // 总费用
});

const mockBillingDetailData = (roomId) => ({
  roomId,
  lowDuration: 60, // 低风时长（分钟）
  mediumDuration: 30, // 中风时长（分钟）
  highDuration: 0, // 高风时长（分钟）
  lowPeriods: ["14:00-15:00"], // 低风时段
  mediumPeriods: ["15:00-15:30"], // 中风时段
  highPeriods: [], // 高风时段
  lowCost: 60 * 0.1, // 低风费用（假设0.1元/分钟）
  mediumCost: 30 * 0.2, // 中风费用（假设0.2元/分钟）
  highCost: 0, // 高风费用
  totalCost: 60 * 0.1 + 30 * 0.2 // 总费用
});

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
    const billingInfo = ref({}); // 账单数据
    const billingDetail = ref({}); // 详单数据
    const loading = ref(false); // 整体加载状态
    const loadingDetail = ref(false); // 详单加载状态
    const loadingBill = ref(false); // 账单加载状态
    const isBillFallback = ref(false); // 是否启用账单模拟数据
    const isDetailFallback = ref(false); // 是否启用详单模拟数据

    // 货币格式化函数
    const formatCurrency = (value) => {
      if (value === undefined || value === null || isNaN(value)) return '0.00 元';
      return parseFloat(value).toFixed(2) + ' 元';
    };

watch(
  () => props.selectedRoom,
  async (newVal) => {
    if (!newVal) return;

    localSelectedRoom.value = { ...newVal };
    loading.value = true;

    try {
      // 1. 加载详单数据
      loadingDetail.value = true;
      const detailRes = await axios.get(`/api/room/${newVal.roomId}/billing/detail`);

      // 检查数据有效性
      const detailData = detailRes.data || {};
      if (!detailData.roomId) {
        throw new Error('详单数据为空');
      }

      billingDetail.value = detailData;
    } catch (detailError) {
      console.error('详单加载失败，使用模拟数据:', detailError);
      billingDetail.value = mockBillingDetailData(newVal.roomId);
      isDetailFallback.value = true;
      ElMessage.warning('详单数据加载失败，已使用本地模拟数据');
    } finally {
      loadingDetail.value = false;
    }

    // 2. 加载账单数据（逻辑相同）
    try {
      loadingBill.value = true;
      const billRes = await axios.get(`/api/room/${newVal.roomId}/billing`);

      const billData = billRes.data || {};
      if (!billData.roomId) {
        throw new Error('账单数据为空');
      }

      billingInfo.value = billData;
    } catch (billError) {
      console.error('账单加载失败，使用模拟数据:', billError);
      billingInfo.value = mockBillingData(newVal.roomId);
      isBillFallback.value = true;
      ElMessage.warning('账单数据加载失败，已使用本地模拟数据');
    } finally {
      loadingBill.value = false;
      loading.value = false;
    }
  },
  { immediate: true, deep: true }
);

    // 确认退房逻辑（添加接口调用）
    const handleConfirm = async () => {
      if (!localSelectedRoom.value?.roomId) {
        ElMessage.warning('请选择需要退房的房间');
        return;
      }

      const roomId = localSelectedRoom.value.roomId;
      loading.value = true;

      try {
        // 调用 checkout 接口
        await axios.post(`/api/room/${roomId}/checkout`);

        // 获取最新的账单数据（可选：如需实时更新账单）
        // const billingRes = await axios.get(`/api/room/${roomId}/billing`);
        // billingInfo.value = { ...billingRes.data };

        emit('confirmCheckout', roomId);
        ElMessage.success('退房成功');
        emit('close'); // 关闭弹窗
      } catch (error) {
        console.error('退房接口调用失败:', error);
        ElMessage.error('退房失败，请联系管理员');
        // 若接口返回错误信息，可提取并展示
        if (error.response?.data?.message) {
          ElMessage.error(error.response.data.message);
        }
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
      billingInfo,
      billingDetail,
      loading,
      loadingDetail,
      loadingBill,
      formatCurrency,
      handleConfirm,
      printBill,
      printDetails,
      isBillFallback,
      isDetailFallback
    };
  }
};
</script>

<style scoped>
.checkout-detail {
  padding: 30px;
  background-color: #f9f9f9;
}

.customer-info-card,
.bill-card,
.details-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.detail-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
}

.detail-item h4 {
  color: #333;
  margin-bottom: 10px;
}

.total-cost {
  font-size: 18px;
  color: #e74c3c;
  font-weight: bold;
  margin-top: 20px;
  text-align: right;
}

/* 加载状态样式优化 */
.el-skeleton {
  min-height: 200px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-col {
    flex-basis: 100% !important;
    max-width: 100%;
  }
}
</style>
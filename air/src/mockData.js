// mockData.js
import axios from 'axios';
import dayjs from 'dayjs'; // 用来生成入住、退房时间

// 生成时间
const now = dayjs();
const defaultCheckInTime = now.subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss'); // 默认入住时间：昨天
const defaultCheckOutTime = now.add(2, 'day').format('YYYY-MM-DDTHH:mm:ss');     // 默认退房时间：后天

// 模拟的剩余房间数据
const remainingRoomsMockData = [
    { roomId: 101, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 102, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 103, occupied: true, checkInTime: defaultCheckInTime, checkOutTime: defaultCheckOutTime },
    { roomId: 104, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 105, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 106, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 107, occupied: true, checkInTime: defaultCheckInTime, checkOutTime: defaultCheckOutTime },
    { roomId: 108, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 109, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 110, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 201, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 202, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 203, occupied: true, checkInTime: defaultCheckInTime, checkOutTime: defaultCheckOutTime },
    { roomId: 204, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 205, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 206, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 207, occupied: true, checkInTime: defaultCheckInTime, checkOutTime: defaultCheckOutTime },
    { roomId: 208, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 209, occupied: false, checkInTime: '', checkOutTime: '' },
    { roomId: 210, occupied: false, checkInTime: '', checkOutTime: '' },
];

// 模拟获取剩余房间的 API
const getRemainingRooms = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: JSON.parse(JSON.stringify(remainingRoomsMockData)) });
        }, 1000); // 模拟 1 秒延时
    });
};

// 模拟入住接口
const checkin = (checkinRequest) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (checkinRequest.roomId) {
                resolve("入住成功");
            } else {
                reject("入住失败");
            }
        }, 1000); // 模拟 1 秒延时
    });
};

// ✨ 新增：模拟获取空调状态的接口
const airConditionStatusMockData = {
  101: { currentTemperature: 25, targetTemperature: 22, windSpeed: '低风' },
  102: { currentTemperature: 20, targetTemperature: 24, windSpeed: '中风' },
  103: { currentTemperature: 28, targetTemperature: 26, windSpeed: '高风' },
  104: { currentTemperature: 28, targetTemperature: 24, windSpeed: '高风' },
  105: { currentTemperature: 25, targetTemperature: 27, windSpeed: '中风' },
  106: { currentTemperature: 22, targetTemperature: 22, windSpeed: '高风' },
  107: { currentTemperature: 23, targetTemperature: 23, windSpeed: '低风' },
  108: { currentTemperature: 26, targetTemperature: 25, windSpeed: '高风' },
  109: { currentTemperature: 23, targetTemperature: 24, windSpeed: '中风' },
  110: { currentTemperature: 28, targetTemperature: 25, windSpeed: '高风' },
  201: { currentTemperature: 22, targetTemperature: 23, windSpeed: '中风' },
  202: { currentTemperature: 27, targetTemperature: 25, windSpeed: '高风' },
  203: { currentTemperature: 22, targetTemperature: 23, windSpeed: '低风' },
  204: { currentTemperature: 23, targetTemperature: 27, windSpeed: '高风' },
  205: { currentTemperature: 24, targetTemperature: 24, windSpeed: '中风' },
  206: { currentTemperature: 27, targetTemperature: 23, windSpeed: '高风' },
  207: { currentTemperature: 28, targetTemperature: 25, windSpeed: '低风' },
  208: { currentTemperature: 23, targetTemperature: 26, windSpeed: '高风' },
  209: { currentTemperature: 25, targetTemperature: 23, windSpeed: '中风' },
  210: { currentTemperature: 22, targetTemperature: 25, windSpeed: '高风' }
};

const getAirConditionStatus = (roomId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const status = airConditionStatusMockData[roomId] || {
        currentTemperature: 25,
        targetTemperature: 22,
        windSpeed: '低风'
      };
      resolve({ data: status });
    }, 1000);
  });
};

export function setTargetTemperature(roomId, temperature) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (airConditionStatusMockData[roomId]) {
        airConditionStatusMockData[roomId].targetTemperature = temperature;
        resolve({ success: true });
      } else {
        reject(new Error('Room not found'));
      }
    }, 500);
  });
}

export function setWindSpeed(roomId, speed) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (airConditionStatusMockData[roomId]) {
        airConditionStatusMockData[roomId].windSpeed = speed;
        resolve({ success: true });
      } else {
        reject(new Error('Room not found'));
      }
    }, 500);
  });
}


// 新增：用于仅获取账单和详单数据的函数
const fetchBillAndDetails = ({ roomId }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`开始获取房间 ${roomId} 的账单和详单数据`);

      const roomIndex = remainingRoomsMockData.findIndex(room => room.roomId === roomId);

      if (roomIndex === -1) {
        console.error(`房间号不存在：${roomId}`);
        reject("获取失败：房间号不存在");
        return;
      }

      // 根据 roomId 生成详单信息
      const detailsInfo = generateDetailsInfo(roomId);
      const detailsTotalFee = calculateTotalCost(detailsInfo);

      // 使用入住时间作为checkInTime，当前时间为模拟的checkOutTime来生成账单信息
      const now = new Date();
      const formattedCheckOutTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

      // 模拟生成账单信息而不改变房间状态
      const billInfo = generateBillInfo(roomId, remainingRoomsMockData[roomIndex].checkInTime, formattedCheckOutTime, detailsTotalFee);

      resolve({
        billInfo,
        detailsInfo,
        detailsTotalFee
      });
    }, 500); // 模拟异步请求延迟
  });
};

// 现有的checkout函数保持不变，但只处理退房逻辑
const checkout = ({ roomId }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`开始处理退房，房间号：${roomId}`); // 添加日志

      const roomIndex = remainingRoomsMockData.findIndex(room => room.roomId === roomId);

      if (roomIndex === -1) {
        console.error(`房间号不存在：${roomId}`); // 添加日志
        reject("退房失败：房间号不存在");
        return;
      }

      if (!remainingRoomsMockData[roomIndex].occupied) {
        console.error(`房间未被占用：${roomId}`); // 添加日志
        reject("退房失败：房间未被占用");
        return;
      }

      // 获取当前时间作为退房时间
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

      // 使用深拷贝来更新房间状态
      const updatedRoom = {
        ...remainingRoomsMockData[roomIndex],
        occupied: false,
        checkInTime: remainingRoomsMockData[roomIndex].checkInTime,
        checkOutTime: formattedTime
      };

      remainingRoomsMockData[roomIndex] = updatedRoom;

      // 根据 roomId 生成详单信息
      const detailsInfo = generateDetailsInfo(roomId);
      const detailsTotalFee = calculateTotalCost(detailsInfo);

      // 使用详单总费用来生成账单信息
      const billInfo = generateBillInfo(roomId, updatedRoom.checkInTime, formattedTime, detailsTotalFee);

      console.log(`房间 ${roomId} 退房成功，账单数据：`, { billInfo, detailsInfo });

      resolve({
        message: "退房成功",
        room: updatedRoom,
        billInfo,
        detailsInfo,
        detailsTotalFee
      });
    }, 1000); // 模拟异步操作延迟
  });
};
// 🌟辅助函数：生成账单基本信息
function generateBillInfo(roomId, checkInTime, checkOutTime, detailsTotalFee) {
  // 可以根据不同房间类型或时间段计算价格
  const basePriceMap = {
    101: 150, 102: 120, 103: 180, 104: 130, 105: 140,
    201: 200, 202: 180, 203: 220, 204: 210, 205: 190
  };

  const pricePerDay = basePriceMap[roomId] || 150;

  // 计算入住天数（简单按小时计算）
  const checkInDate = new Date(checkInTime);
  const checkOutDate = new Date();
  const hoursStayed = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60));
  const daysStayed = Math.ceil(hoursStayed / 24);

  const accommodationFee = (pricePerDay * daysStayed).toFixed(2) + '元';

  // 使用传入的详单总费用作为空调费
  const airConditioningFee = detailsTotalFee;

  const totalFee = (parseFloat(accommodationFee) + parseFloat(detailsTotalFee.replace('元', ''))).toFixed(2) + '元';

  return {
    accommodationFee,
    airConditioningFee,
    totalFee
  };
}



// 🌟辅助函数：生成详单信息（低风、中风、高风），每种风速都必须有记录，未使用则费用为0
function generateDetailsInfo() {
  const windRecords = ['低风', '中风', '高风'];
  const result = {};

  // 初始化每种风速为默认值
  windRecords.forEach(wind => {
    result[wind] = {
      title: wind,
      usageDuration: '0小时',
      usagePeriod: '00:00 - 00:00',
      totalCost: '0.00元'
    };
  });

  // 随机生成1~3条记录
  const recordCount = 1 + Math.floor(Math.random() * 3); // 生成1到3条记录
  const usedWinds = new Set();

  for (let i = 0; i < recordCount; i++) {
    let wind;
    do {
      wind = windRecords[Math.floor(Math.random() * windRecords.length)];
    } while (usedWinds.has(wind)); // 确保不重复选择同一风速

    usedWinds.add(wind);

    const duration = 1 + Math.floor(Math.random() * 5); // 1~5 小时
    const startHour = Math.floor(Math.random() * 20);
    const endHour = startHour + duration;
    const cost = (duration * (wind === '低风' ? 3 : wind === '中风' ? 5 : 8)).toFixed(2) + '元';

    result[wind] = {
      title: wind,
      usageDuration: `${duration}小时`,
      usagePeriod: `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00`,
      totalCost: cost
    };
  }

  // 返回按顺序排列的数组形式
  return windRecords.map(wind => result[wind]);
}

// 🌟辅助函数：计算详单总费用
function calculateTotalCost(details) {
  let total = 0;
  details.forEach(item => {
    total += parseFloat(item.totalCost.replace('元', ''));
  });
  return total.toFixed(2) + '元';
}

// 添加到 axios 的 post 请求处理中
axios.post = (url, data) => {
  if (url.endsWith('/api/rooms/checkin')) {
    return checkin(data);
  } else if (url.endsWith('/api/rooms/checkout')) {
    return checkout(data); // ✅ 直接传递整个 data 对象
  } else if(url.startsWith('/api/air-condition')) {
    const roomId = url.split('/').pop(); // 提取 roomId
    return getAirConditionStatus(roomId);
  } else {
    return Promise.reject(new Error('Unknown POST endpoint'));
  }
};

// 替换前端的 axios 请求
//axios.get = getRemainingRooms;
//axios.post = checkin;

export { getRemainingRooms, checkin ,getAirConditionStatus, checkout,fetchBillAndDetails };

const validCredentials = {
  '101': '12345678',
  '102': '87654321',
  '201': '11223344',
  '202': '44332211'
  // 可根据需要添加更多房间号和密码
};

export function validateRoomCredentials(roomNumber, cardPassword) {
  return validCredentials[roomNumber] === cardPassword;
}
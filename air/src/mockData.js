// mockData.js。用于frontdeskcheckin和login数据模拟
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
            resolve({ data: remainingRoomsMockData });
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
  // 可以继续添加更多房间的空调状态
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
// mockData.js 示例
export function setTargetTemperature(roomId, temperature) {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 假设 airConditionStatusMockData 是存储所有房间空调状态的对象
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

// 替换前端的 axios 请求
axios.get = (url) => {
  if (url.startsWith('/api/rooms')) {
    return getRemainingRooms();
  } else if (url.startsWith('/api/air-condition')) {
    const roomId = url.split('/').pop(); // 提取 roomId
    return getAirConditionStatus(roomId);
  }
  return Promise.reject(new Error('Unknown GET endpoint'));
};

// 替换前端的 axios 请求
//axios.get = getRemainingRooms;
//axios.post = checkin;

export { getRemainingRooms, checkin ,getAirConditionStatus};

const validCredentials = {
  '101': '12345678',
  '102': '87654321',
  '201': '11223344',
  '202': '44332211'
  // 可根据需要添加更多房间号和密码
}

export function validateRoomCredentials(roomNumber, cardPassword) {
  return validCredentials[roomNumber] === cardPassword
}
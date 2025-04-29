// mockData.js
import axios from 'axios';

// 模拟的剩余房间数据
const remainingRoomsMockData = [
  { roomId: 101, status: 'available' },
  { roomId: 102, status: 'available' },
  { roomId: 103, status: 'occupied' },
  { roomId: 104, status: 'available' }
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

// 替换前端的 axios 请求
axios.get = getRemainingRooms;
axios.post = checkin;

export { getRemainingRooms, checkin };

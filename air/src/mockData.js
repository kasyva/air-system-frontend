// mockData.js。用于frontdeskcheckin数据模拟
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

// 替换前端的 axios 请求
axios.get = getRemainingRooms;
axios.post = checkin;

export { getRemainingRooms, checkin };

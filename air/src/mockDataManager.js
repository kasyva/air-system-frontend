// mockDataManager.js

export async function getLineChartMockData(timeRange, roomId) {
  const x = timeRange === 'day'
    ? ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
    : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  const y = x.map(() => +(Math.random() * 15 + 5).toFixed(2)) // 5-20 元

  return {
    title: {
      text: `空调费用趋势 - ${roomId || '所有房间'}`,
      left: 'center'
    },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: x },
    yAxis: { type: 'value' },
    series: [
      {
        name: '费用',
        type: 'line',
        smooth: true,
        data: y
      }
    ]
  }
}

export async function getPieChartMockData(type, roomId) {
  let data
  if (type === 'fee') {
    data = [
      { value: 400 + Math.floor(Math.random() * 100), name: '住宿费' },
      { value: 80 + Math.floor(Math.random() * 50), name: '空调费' }
    ]
  } else {
    data = [
      { value: 150 + Math.floor(Math.random() * 50), name: '低风' },
      { value: 200 + Math.floor(Math.random() * 60), name: '中风' },
      { value: 70 + Math.floor(Math.random() * 30), name: '高风' }
    ]
  }

  return {
    title: {
      text: `${type === 'fee' ? '费用占比' : '风速时间占比'} - ${roomId || '所有房间'}`,
      left: 'center'
    },
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center' },
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

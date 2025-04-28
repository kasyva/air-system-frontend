// src/tests/FrontDesk.test.js
import { render, fireEvent } from '@testing-library/vue';
import FrontDesk from '../components/FrontDesk.vue';
import axios from 'axios';

// 确保 Jest 已经正确导入
jest.mock('axios');

describe('FrontDesk Component', () => {
  test('renders form and room selection correctly', async () => {
    // 渲染组件
    const { getByLabelText, getByText, getAllByRole } = render(FrontDesk);

    // 检查表单元素是否正确渲染
    expect(getByLabelText(/姓名/i)).toBeInTheDocument();
    expect(getByLabelText(/身份证号/i)).toBeInTheDocument();
    expect(getByLabelText(/电话/i)).toBeInTheDocument();
    expect(getByLabelText(/入住时间/i)).toBeInTheDocument();
    expect(getByLabelText(/入住天数/i)).toBeInTheDocument();

    // 模拟获取剩余房间的请求
    axios.get.mockResolvedValue({
      data: [
        { roomId: '101', status: 'available' },
        { roomId: '102', status: 'occupied' },
        { roomId: '103', status: 'available' }
      ]
    });

    // 点击查询空余房间按钮
    const queryButton = getByText('查询空余房间');
    await fireEvent.click(queryButton);

    // 检查是否有可用房间显示
    const availableRooms = getAllByRole('button').filter(button => button.textContent === '101' || button.textContent === '103');
    expect(availableRooms.length).toBe(2);
    expect(availableRooms[0]).not.toBeDisabled();
    expect(availableRooms[1]).not.toBeDisabled();

    // 选择一个房间
    await fireEvent.click(availableRooms[0]);

    // 确认入住
    const confirmButton = getByText('确认入住');
    await fireEvent.click(confirmButton);

    // 检查悬浮窗口是否显示
    const dialog = getByText('入住成功！');
    expect(dialog).toBeInTheDocument();
  });

  test('displays error when no room is selected', async () => {
    // 渲染组件
    const { getByText } = render(FrontDesk);

    // 尝试直接点击确认入住按钮
    const confirmButton = getByText('确认入住');
    await fireEvent.click(confirmButton);

    // 检查是否弹出警告
    expect(window.alert).toHaveBeenCalledWith("请先选择空余房间");
  });
});
import {render, fireEvent, waitFor} from '@testing-library/vue';
import {ElButton, ElInput, ElForm, ElFormItem, ElCol, ElDatePicker, ElTimePicker, ElDialog} from 'element-plus';
import FrontDesk from '@/views/FrontDeskCheckinPage.vue';
import {vi} from 'vitest';
import axios from 'axios';

// Mock axios 以模拟后端数据
vi.mock('axios');

// 手动注册 element-plus 组件
const globalComponents = {
    ElButton,
    ElInput,
    ElForm,
    ElFormItem,
    ElCol,
    ElDatePicker,
    ElTimePicker,
    ElDialog
};

describe('FrontDesk Component', () => {
    it('should render the list of remaining rooms and allow room selection', async () => {
        // 模拟的空余房间数据
        const mockRemainingRooms = [
            {roomId: 101, occupied: false},
            {roomId: 102, occupied: false}
        ];

        // 设置 axios mock 返回的数据
        axios.get.mockResolvedValue({data: mockRemainingRooms});

        // 渲染组件，并注册所有需要的 element-plus 组件
        const {getByText, getAllByTestId} = render(FrontDesk, {
            global: {
                components: globalComponents // 注册全局组件
            }
        });

        // 触发查询空余房间按钮
        const queryButton = getByText('查询空余房间');
        await fireEvent.click(queryButton);

        // 等待房间列表渲染
        await waitFor(() => {
            const roomButtons = getAllByTestId('room-button');
            expect(roomButtons.length).toBe(2); // 检查是否渲染了两个房间
        });

        // 点击第一个房间按钮，检查是否选中
        const firstRoomButton = getAllByTestId('room-button')[0];
        await fireEvent.click(firstRoomButton);

        // 确认已选房间的状态
        expect(firstRoomButton).toHaveAttribute('disabled'); // 房间按钮变为禁用
    });

    it('should not allow to confirm checkin without selecting a room', async () => {
        // 渲染组件，并注册所有需要的 element-plus 组件
        const {getByText} = render(FrontDesk, {
            global: {
                components: globalComponents // 注册全局组件
            }
        });

        // 触发确认入住按钮
        const confirmButton = getByText('确认入住');
        await fireEvent.click(confirmButton);

        // 验证弹出窗口未显示（没有房间选择时，不能确认入住）
        const dialog = getByText('入住成功！');
        expect(dialog).to.not.exist; // 使用 Chai 的断言方法
    });
});

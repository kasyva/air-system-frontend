// src/tests/TestComponent.test.js
// 测试了一下testing-library库，可以用
import { render, fireEvent } from '@testing-library/vue';
import TestComponent from '@/components/TestComponent.vue';

test('it should render initial count and increment on button click', async () => {
  // 渲染组件
  const { getByTestId } = render(TestComponent);

  // 获取初始文本
  const countText = getByTestId('clicked');
  expect(countText.textContent).toBe('Times clicked: 0');  // 初始值为 0

  // 获取按钮并触发点击事件
  const button = getByTestId('increment');
  await fireEvent.click(button);

  // 点击后检查文本是否更新
  expect(countText.textContent).toBe('Times clicked: 1');  // 点击后值应为 1
});

import { clipboard } from 'electron';
import { U } from 'win32-api';
import robot from 'robotjs';
import * as tools from '../../../utils/tools.js';

const user32 = U.load();

const get_rc_window = () => {
    let rc_window = user32.FindWindowExW(0, 0, null, Buffer.from('浪漫庄园 2.01\0', 'ucs2'));
    if (!(typeof rc_window === 'number' && rc_window > 0)
        && !(typeof rc_window === 'bigint' && rc_window > 0)
        && !(typeof rc_window === 'string' && rc_window.length > 0)
    ) {
        throw new Error('找不到浪漫庄园窗口');
    } else {
        return rc_window;
    }
};

const get_window_rect = (window) => {
    let rect = Buffer.alloc(16);
    let res = user32.GetWindowRect(window, rect);
    if (!res) throw new Error('获取窗口位置失败');
    return {
        left: rect.readInt32LE(0),
        top: rect.readInt32LE(4),
        right: rect.readInt32LE(8),
        bottom: rect.readInt32LE(12),
        center_x: (rect.readInt32LE(0) + rect.readInt32LE(8)) / 2,
        center_y: (rect.readInt32LE(4) + rect.readInt32LE(12)) / 2,
    };
};

const put_window_foreground = (window) => {
    user32.ShowWindow(window, 1);
    user32.SetForegroundWindow(window);
};

export const jump_to_path = async (path) => {
    // 找到浪漫庄园窗口
    let rc_window = get_rc_window();
    // 置于前台
    put_window_foreground(rc_window);
    // 获取浪漫庄园窗口位置
    let rc_window_rect = get_window_rect(rc_window);
    // 记录当前鼠标位置
    let { x: mouse_x, y: mouse_y } = robot.getMousePos();
    // 点击地图按钮
    robot.moveMouse(rc_window_rect.right - 15, rc_window_rect.top + 58);
    robot.mouseClick();
    // 等待地图展开
    await tools.sleep(200);
    // 点击路径输入框
    robot.moveMouse(rc_window_rect.center_x - 176, rc_window_rect.center_y + 250);
    robot.mouseClick();
    // 返回原来的鼠标位置
    robot.moveMouse(mouse_x, mouse_y);
    // 把路径复制到剪贴板
    clipboard.write({
        text: path,
    });
    // 粘贴到输入框
    robot.keyTap('v', 'control');
    // 确认跳转
    robot.keyTap('enter');
};
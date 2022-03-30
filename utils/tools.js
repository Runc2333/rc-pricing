export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const get_query_arg = (target) => {
    let qs = (location.search.length > 0 ? location.search.substr(1) : ''),
        //保存每一项
        args = {},
        //得到每一项
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        len = items.length;

    for (let i = 0; i < len; i++) {
        item = items[i].split('='),
            name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args[target];
};
export const edit_distance = (s1, s2) => {
    const len1 = s1.length;
    const len2 = s2.length;
    let matrix = [];
    for (let i = 0; i <= len1; i++) {
        // 构造二维数组
        matrix[i] = new Array();
        for (let j = 0; j <= len2; j++) {
            // 初始化
            if (i == 0) {
                matrix[i][j] = j;
            } else if (j == 0) {
                matrix[i][j] = i;
            } else {
                // 进行最小值分析
                let cost = 0;
                if (s1[i - 1] != s2[j - 1]) { // 相同为0，不同置1
                    cost = 1;
                }
                const temp = matrix[i - 1][j - 1] + cost;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, temp);
            }
        }
    }
    return matrix[len1][len2]; //返回右下角的值
};

export const similarity = (x, y) => {
    return 1 - (edit_distance(x, y) / Math.max(x.length, y.length));
};
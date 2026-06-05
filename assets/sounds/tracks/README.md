# 音频文件说明

## 目录结构

```
assets/sounds/
  background.mp3          # 主页背景音乐
  human.mp3               # 人声馆卡片悬停预览
  nature.mp3
  animal.mp3
  tracks/
    human-01.mp3 … human-05.mp3
    nature-01.mp3 … nature-04.mp3
    animal-01.mp3 … animal-04.mp3
```

## 无法播放的常见原因

1. **文件不存在或命名不一致**  
   路径必须与 `js/data.js` 中 `file` 字段完全一致（区分大小写）。

2. **用 `file://` 直接打开 HTML**  
   浏览器会限制本地音频加载。请使用本地服务器，例如在项目根目录执行：
   ```bash
   npx --yes serve .
   ```
   然后访问 `http://localhost:3000`。

3. **编码格式**  
   请使用浏览器通用的 **MP3（MPEG Layer III）**，建议 44.1kHz、CBR 或标准 VBR。

4. **路径层级**  
   馆页在 `galleries/` 下，播放器使用 `../assets/sounds/tracks/xxx.mp3`。

播放失败时，馆页会在对应曲目下方显示红色提示文字。

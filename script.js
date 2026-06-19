let dateFormat = "YYYY/MM/DD";
let weekdayFormat = "JP";
let timeUnit = "hms";
let colonVisible = true;
let lastBlink = Date.now();
let currentTimezone = "Asia/Tokyo";
let showTimezone = true;

/* =========================
   共通関数
========================= */

function getComplementaryColor(hexColor) {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#ffffff';

  const original = parseInt(hex, 16);
  const inverted = 0xFFFFFF ^ original;

  return '#' + inverted.toString(16).padStart(6, '0');
}

function showNotification(message) {
  const el = document.getElementById('notification');

  el.textContent = message;
  el.classList.add('show');

  setTimeout(() => {
    el.classList.remove('show');
  }, 3000);
}

function toMinutes(h, m) {
  return h * 60 + m;
}

function range(now, sh, sm, eh, em) {
  return now >= toMinutes(sh, sm) &&
         now < toMinutes(eh, em);
}

/* =========================
   次の授業表示
========================= */

function showNextClass(messageEl, totalMinutes, dayNum) {

  let schedule = [];

  /* 月曜 */
  if (dayNum === 1) {
    schedule = [
      [9,30,"始まりの会"],
      [9,45,"コミュニティ活動"],
      [10,45,"コミュニティ活動"],
      [11,45,"科目学習サポート"],
      [13,15,"科目学習サポート / 英検準二級対策"],
      [14,15,"プログラミング / 英検準二級対策"],
      [15,15,"選択学習 / グループディスカッション"],
      [16,5,"帰りの会"]
    ];
  }

  /* 火曜 */
  else if (dayNum === 2) {
    schedule = [
      [9,30,"始まりの会"],
      [9,45,"PBL"],
      [10,45,"PBL"],
      [11,45,"科目学習サポート"],
      [13,15,"科目学習サポート / リベラルアーツ応用"],
      [14,15,"プログラミング / リベラルアーツ応用"],
      [15,15,"選択学習 / グループディスカッション"],
      [16,5,"帰りの会"]
    ];
  }

  /* 水曜 */
  else if (dayNum === 3) {
    schedule = [
      [9,30,"始まりの会"],
      [9,45,"PBL"],
      [10,45,"PBL"],
      [11,45,"科目学習サポート / 英語初級"],
      [13,15,"科目学習サポート"],
      [14,15,"プログラミング"],
      [15,15,"選択学習"],
      [16,5,"帰りの会"]
    ];
  }

  /* 木曜 */
  else if (dayNum === 4) {
    schedule = [
      [9,30,"始まりの会"],
      [9,45,"キャンパス授業"],
      [10,45,"キャンパス授業"],
      [11,45,"科目学習サポート"],
      [13,15,"科目学習サポート"],
      [14,15,"プログラミング"],
      [15,15,"選択学習"],
      [16,5,"帰りの会"]
    ];
  }

  /* 金曜 */
  else if (dayNum === 5) {
    schedule = [
      [9,30,"始まりの会"],
      [9,45,"PBL"],
      [10,45,"PBL"],
      [11,45,"科目学習サポート / 英語中級"],
      [13,15,"科目学習サポート"],
      [14,15,"プログラミング"],
      [15,15,"選択学習 / ミライ"],
      [16,5,"帰りの会"]
    ];
  }

  for (let i = 0; i < schedule.length; i++) {

    const startMinutes =
      toMinutes(schedule[i][0], schedule[i][1]);

    if (totalMinutes < startMinutes) {

      const remain = startMinutes - totalMinutes;

      messageEl.textContent =
        `次の授業（${schedule[i][2]}）まであと${remain}分`;

      return;
    }
  }

  messageEl.textContent = "本日の予定は終了しました";
}

/* =========================
   授業表示
========================= */

function getClassMessage(totalMinutes, dayNum) {

  /* =========================
     月曜
  ========================= */

  if (dayNum === 1) {

    if (range(totalMinutes,9,30,9,45))
      return "始まりの会";

    else if (range(totalMinutes,9,45,10,30))
      return "コミュニティ活動";

    else if (range(totalMinutes,10,30,10,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,10,45,11,30))
      return "コミュニティ活動";

    else if (range(totalMinutes,11,30,11,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,11,45,12,30))
      return "科目学習サポート";

    else if (range(totalMinutes,12,30,12,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,13,15,14,0))
      return "科目学習サポート / 英検準二級対策";

    else if (range(totalMinutes,14,0,14,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,14,15,14,55))
      return "プログラミング / 英検準二級対策";

    else if (range(totalMinutes,14,55,15,0))
      return "残り10分になりました。今日の成果をスラックに投稿しましょう";

    else if (range(totalMinutes,15,0,15,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,15,15,16,0))
      return "選択学習 / グループディスカッション";

    else if (range(totalMinutes,16,0,16,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,16,5,16,25))
      return "帰りの会";
  }

  /* =========================
     火曜
  ========================= */

  else if (dayNum === 2) {

    if (range(totalMinutes,9,30,9,45))
      return "始まりの会";

    else if (range(totalMinutes,9,45,10,30))
      return "PBL";

    else if (range(totalMinutes,10,30,10,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,10,45,11,30))
      return "PBL";

    else if (range(totalMinutes,11,30,11,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,11,45,12,30))
      return "科目学習サポート";

    else if (range(totalMinutes,12,30,12,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,13,15,14,0))
      return "科目学習サポート / リベラルアーツ応用";

    else if (range(totalMinutes,14,0,14,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,14,15,14,55))
      return "プログラミング / リベラルアーツ応用";

    else if (range(totalMinutes,14,55,15,0))
      return "残り10分になりました。今日の成果をスラックに投稿しましょう";

    else if (range(totalMinutes,15,0,15,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,15,15,16,0))
      return "選択学習 / グループディスカッション";

     else if (range(totalMinutes,16,0,16,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,16,5,16,25))
      return "帰りの会";
  }

  /* =========================
     水曜
  ========================= */

  else if (dayNum === 3) {

    if (range(totalMinutes,9,30,9,45))
      return "始まりの会";

    else if (range(totalMinutes,9,45,10,30))
      return "PBL";

    else if (range(totalMinutes,10,30,10,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,10,45,11,30))
      return "PBL";

    else if (range(totalMinutes,11,30,11,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,11,45,12,30))
      return "科目学習サポート / 英語初級";

    else if (range(totalMinutes,12,30,12,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,13,15,14,0))
      return "科目学習サポート";

    else if (range(totalMinutes,14,0,14,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,14,15,14,55))
      return "プログラミング";

    else if (range(totalMinutes,14,55,15,0))
      return "残り10分になりました。今日の成果をスラックに投稿しましょう";

    else if (range(totalMinutes,15,0,15,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,15,15,16,0))
      return "選択学習";

    else if (range(totalMinutes,16,0,16,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,16,5,16,25))
      return "帰りの会";
  }

  /* =========================
     木曜
  ========================= */

  else if (dayNum === 4) {

    if (range(totalMinutes,9,30,9,45))
      return "始まりの会";

    else if (range(totalMinutes,9,45,10,30))
      return "キャンパス授業";

    else if (range(totalMinutes,10,30,10,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,10,45,11,30))
      return "キャンパス授業";

    else if (range(totalMinutes,11,30,11,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,11,45,12,30))
      return "科目学習サポート";

    else if (range(totalMinutes,12,30,12,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,13,15,14,0))
      return "科目学習サポート";

    else if (range(totalMinutes,14,0,14,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,14,15,14,55))
      return "プログラミング";

    else if (range(totalMinutes,14,55,15,0))
      return "残り10分になりました。今日の成果をスラックに投稿しましょう";

    else if (range(totalMinutes,15,0,15,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,15,15,16,0))
      return "選択学習";

    else if (range(totalMinutes,16,0,16,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,16,5,16,25))
      return "帰りの会";
  }

  /* =========================
     金曜
  ========================= */

  else if (dayNum === 5) {

    if (range(totalMinutes,9,30,9,45))
      return "始まりの会";

    else if (range(totalMinutes,9,45,10,30))
      return "PBL";

    else if (range(totalMinutes,10,30,10,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,10,45,11,30))
      return "PBL";

    else if (range(totalMinutes,11,30,11,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,11,45,12,30))
      return "科目学習サポート / 英語中級";

    else if (range(totalMinutes,12,30,12,35))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,13,15,14,0))
      return "科目学習サポート";

    else if (range(totalMinutes,14,0,14,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,14,15,14,55))
      return "プログラミング";

    else if (range(totalMinutes,14,55,15,0))
      return "残り10分になりました。今日の成果をスラックに投稿しましょう";

    else if (range(totalMinutes,15,0,15,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,15,15,16,0))
      return "選択学習 / ミライ";

    else if (range(totalMinutes,16,0,16,5))
      return "残り5分となりました。日誌を記入してください";

    else if (range(totalMinutes,16,5,16,25))
      return "帰りの会";
  }

  return null;
}

/* =========================
   時計更新
========================= */

function updateClock() {

  const now = new Date();

  const options = {
    timeZone: currentTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const dateTimeFormat =
    new Intl.DateTimeFormat("en-US", options);

  const parts =
    dateTimeFormat.formatToParts(now);

  const partMap =
    Object.fromEntries(parts.map(p => [p.type, p.value]));

  const hours = partMap.hour;
  const minutes = partMap.minute;
  const seconds = partMap.second;

  const milliseconds =
    String(now.getMilliseconds())
      .padStart(3, '0')
      .slice(0, 2);

  const year = partMap.year;
  const month = partMap.month;
  const day = partMap.day;

  const weekdayJP =
    new Intl.DateTimeFormat(
      "ja-JP",
      {
        weekday: "short",
        timeZone: currentTimezone
      }
    ).format(now);

  const weekdayEN =
    new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "short",
        timeZone: currentTimezone
      }
    ).format(now).toUpperCase();

  let weekday = "";

  if (weekdayFormat === "JP") {
    weekday = weekdayJP;
  }
  else if (weekdayFormat === "EN") {
    weekday = weekdayEN;
  }

  let colon = ":";

  if (timeUnit === "hm") {
    colon = colonVisible ? ":" : " ";
  }

  let timeText = "";

  if (timeUnit === "hm") {
    timeText = `${hours}${colon}${minutes}`;
  }

  else if (timeUnit === "hms") {
    timeText = `${hours}:${minutes}:${seconds}`;
  }

  else if (timeUnit === "hmsms") {
    timeText =
      `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  let dateText = "";

  switch (dateFormat) {

    case "MM/DD":
      dateText = `${month}/${day}`;
      break;

    case "MM/DD/YYYY":
      dateText = `${month}/${day}/${year}`;
      break;

    case "DD-MM-YYYY":
      dateText = `${day}-${month}-${year}`;
      break;

    case "NONE":
      dateText = "";
      break;

    case "YYYY/MM/DD":
    default:
      dateText = `${year}/${month}/${day}`;
      break;
  }

  document.getElementById('time').textContent =
    timeText;

  document.getElementById('date').textContent =
    dateText +
    (
      weekdayFormat !== "NONE" && dateText
      ? ` ${weekday}`
      : ""
    );

  /* =========================
     授業表示
  ========================= */

  const messageEl =
    document.getElementById("message");

  const hourNum = Number(hours);
  const minuteNum = Number(minutes);

  const totalMinutes =
    hourNum * 60 + minuteNum;

  const dayNum = now.getDay();

  const currentClass =
    getClassMessage(totalMinutes, dayNum);

  if (currentClass) {
    messageEl.textContent = currentClass;
  }
  else if (dayNum >= 1 && dayNum <= 5) {
    showNextClass(
      messageEl,
      totalMinutes,
      dayNum
    );
  }
  else {
    messageEl.textContent = "休日です";
  }

  /* =========================
     タイムゾーン表示
  ========================= */

  const tzIdDisplay =
    document.getElementById('timezoneIdDisplay');

  tzIdDisplay.textContent =
    currentTimezone;

  tzIdDisplay.style.display =
    showTimezone
      ? 'block'
      : 'none';
}

/* =========================
   フルスクリーン
========================= */

function toggleFullScreen() {

  if (!document.fullscreenElement) {

    document.documentElement
      .requestFullscreen()
      .catch(err => {
        console.error(
          `フルスクリーンにできませんでした: ${err.message}`
        );
      });

  } else {

    document.exitFullscreen();
  }
}

/* =========================
   設定取得
========================= */

function getSettings() {

  return {

    bgColor:
      document.getElementById('bgColorPicker').value,

    textColor:
      document.getElementById('textColorPicker').value,

    timeFont:
      document.getElementById('timeFontSelect').value,

    dateFont:
      document.getElementById('dateFontSelect').value,

    timeSize:
      document.getElementById('timeSizeRange').value,

    dateSize:
      document.getElementById('dateSizeRange').value,

    dateFormat:
      document.getElementById('dateFormatSelect').value,

    weekdayFormat:
      document.getElementById('weekdayFormatSelect').value,

    timeUnit:
      document.getElementById('timeUnitSelect').value,

    timezone:
      document.getElementById('timezoneSelect').value,

    showTimezone:
      document.getElementById('showTimezoneLabel').checked,
    
    messageFont:
    document.getElementById('messageFontSelect').value,
  };
}

/* =========================
   設定適用
========================= */

function applySettings(settings) {

  if (
    settings.textColor.toLowerCase() ===
    settings.bgColor.toLowerCase()
  ) {

    const corrected =
      getComplementaryColor(settings.bgColor);

    settings.textColor = corrected;

    showNotification(
      "背景と文字色が同一のため、文字色を変更しました"
    );
  }

  document.getElementById('bgColorPicker').value =
    settings.bgColor;

  document.getElementById('textColorPicker').value =
    settings.textColor;

  document.getElementById('timeFontSelect').value =
    settings.timeFont;

  document.getElementById('dateFontSelect').value =
    settings.dateFont;

  document.getElementById('timeSizeRange').value =
    settings.timeSize;

  document.getElementById('dateSizeRange').value =
    settings.dateSize;

  document.getElementById('dateFormatSelect').value =
    settings.dateFormat;

  document.getElementById('weekdayFormatSelect').value =
    settings.weekdayFormat;

  document.getElementById('timeUnitSelect').value =
    settings.timeUnit;

  document.getElementById('timezoneSelect').value =
    settings.timezone || "Asia/Tokyo";

  document.getElementById('showTimezoneLabel').checked =
    settings.showTimezone !== false;

  document.getElementById('messageFontSelect').value =
  settings.messageFont;  

  document.getElementById('message').style.fontFamily =
  settings.messageFont;

  dateFormat = settings.dateFormat;
  weekdayFormat = settings.weekdayFormat;
  timeUnit = settings.timeUnit;
  currentTimezone = settings.timezone || "Asia/Tokyo";
  showTimezone = settings.showTimezone !== false;

  document.body.style.backgroundColor =
    settings.bgColor;

  document.body.style.color =
    settings.textColor;

  document.querySelectorAll('.hamburger span')
    .forEach(span => {
      span.style.backgroundColor =
        settings.textColor;
    });

  document.getElementById('time').style.fontFamily =
    settings.timeFont;

  document.getElementById('date').style.fontFamily =
    settings.dateFont;

  document.getElementById('time').style.fontSize =
    settings.timeSize + "vw";

  document.getElementById('date').style.fontSize =
    settings.dateSize + "vw";

  document.getElementById('message').style.color =
  settings.textColor;

  document.getElementById('message').style.fontFamily =
  settings.dateFont;

  document.getElementById('timeSizeValue').textContent =
    settings.timeSize;

  document.getElementById('dateSizeValue').textContent =
    settings.dateSize;
}

/* =========================
   ループ
========================= */

function updateClockLoop() {

  const now = Date.now();

  if (
    timeUnit === "hm" &&
    now - lastBlink >= 1000
  ) {
    colonVisible = !colonVisible;
    lastBlink = now;
  }

  updateClock();

  requestAnimationFrame(updateClockLoop);
}

/* =========================
   起動時
========================= */

window.addEventListener('DOMContentLoaded', () => {

  const saved =
    localStorage.getItem('clockSettings');

  if (saved) {

    applySettings(JSON.parse(saved));

  } else {

    applySettings({

      bgColor: "#000000",
      textColor: "#dddddd",

      timeFont: "'Courier New'",
      dateFont: "'Courier New'",

      timeSize: "16",
      dateSize: "8",

      dateFormat: "YYYY/MM/DD",
      weekdayFormat: "JP",
      timeUnit: "hms",

      timezone: "Asia/Tokyo",

      showTimezone: true,
      messageFont:"'Courier New'",
    });
  }

  /* =========================
     メニュー
  ========================= */

  const menuButton =
    document.getElementById('menu-button');

  const menuPanel =
    document.getElementById('menu-panel');

  menuButton.addEventListener('click', () => {

    menuPanel.classList.toggle('active');

    menuButton.classList.toggle('active');
  });

  /* =========================
     各種変更イベント
  ========================= */

  document.querySelectorAll(
    '#bgColorPicker, #textColorPicker, #timeFontSelect, #dateFontSelect, #dateFormatSelect, #weekdayFormatSelect, #timeUnitSelect, #timezoneSelect, #messageFontSelect'
  ).forEach(el => {

    el.addEventListener('change', () => {

      const settings = getSettings();

      applySettings(settings);

      localStorage.setItem(
        'clockSettings',
        JSON.stringify(settings)
      );
    });
  });

  document.querySelectorAll(
    '#timeSizeRange, #dateSizeRange'
  ).forEach(el => {

    el.setAttribute('min', '1');
    el.setAttribute('max', '20');

    el.addEventListener('input', () => {

      const settings = getSettings();

      applySettings(settings);

      localStorage.setItem(
        'clockSettings',
        JSON.stringify(settings)
      );
    });
  });

  document.getElementById('showTimezoneLabel')
    .addEventListener('change', () => {

      const settings = getSettings();

      applySettings(settings);

      localStorage.setItem(
        'clockSettings',
        JSON.stringify(settings)
      );
    });

  /* =========================
     リセット
  ========================= */

  document.getElementById('resetSettings')
    .addEventListener('click', () => {

      const defaultSettings = {

        bgColor: "#000000",
        textColor: "#dddddd",

        timeFont: "'Courier New'",
        dateFont: "'Courier New'",

        timeSize: "16",
        dateSize: "8",

        dateFormat: "YYYY/MM/DD",
        weekdayFormat: "JP",
        timeUnit: "hms",

        timezone: "Asia/Tokyo",

        showTimezone: true,
        messageFont:"'Courier New'",
      };

      applySettings(defaultSettings);

      localStorage.removeItem('clockSettings');
    });

  /* =========================
     メニュー外クリック
  ========================= */

  document.addEventListener('click', (e) => {

    if (
      menuPanel.classList.contains('active') &&
      !menuPanel.contains(e.target) &&
      !menuButton.contains(e.target)
    ) {

      menuPanel.classList.remove('active');

      menuButton.classList.remove('active');
    }
  });

  updateClockLoop();
});
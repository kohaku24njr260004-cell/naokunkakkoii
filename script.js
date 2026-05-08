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
  setTimeout(() => el.classList.remove('show'), 3000);
}

function toMinutes(h, m) {
  return h * 60 + m;
}

function range(now, sh, sm, eh, em) {
  return now >= toMinutes(sh, sm) && now < toMinutes(eh, em);
}

/* =========================
   休憩時間に次の授業表示
========================= */

function showNextClass(messageEl, totalMinutes, dayNum) {
  let schedule = [];

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

  if (dayNum === 2) {
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

  if (dayNum === 3) {
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

  if (dayNum === 4) {
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

  if (dayNum === 5) {
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
    const start = toMinutes(schedule[i][0], schedule[i][1]);

    if (totalMinutes < start) {
      const remain = start - totalMinutes;
      messageEl.textContent =
        `次の授業（${schedule[i][2]}）まであと${remain}分`;
      return;
    }
  }

  messageEl.textContent = "本日の予定は終了しました";
}

/* =========================
   メイン時計更新
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
    hour12: false
  };

  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);
  const parts = dateTimeFormat.formatToParts(now);
  const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

  const hours = partMap.hour;
  const minutes = partMap.minute;
  const seconds = partMap.second;
  const milliseconds =
    String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);

  const year = partMap.year;
  const month = partMap.month;
  const day = partMap.day;

  const weekdayJP = new Intl.DateTimeFormat(
    "ja-JP",
    { weekday:"short", timeZone: currentTimezone }
  ).format(now);

  const weekdayEN = new Intl.DateTimeFormat(
    "en-US",
    { weekday:"short", timeZone: currentTimezone }
  ).format(now).toUpperCase();

  let weekday = "";
  if (weekdayFormat === "JP") weekday = weekdayJP;
  if (weekdayFormat === "EN") weekday = weekdayEN;

  let colon = ":";
  if (timeUnit === "hm") {
    colon = colonVisible ? ":" : " ";
  }

  let timeText = "";
  if (timeUnit === "hm") {
    timeText = `${hours}${colon}${minutes}`;
  } else if (timeUnit === "hms") {
    timeText = `${hours}:${minutes}:${seconds}`;
  } else {
    timeText = `${hours}:${minutes}:${seconds}.${milliseconds}`;
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
    default:
      dateText = `${year}/${month}/${day}`;
  }

  document.getElementById("time").textContent = timeText;
  document.getElementById("date").textContent =
    dateText + (weekdayFormat !== "NONE" && dateText ? ` ${weekday}` : "");

  /* =========================
     授業表示
  ========================= */

  const messageEl = document.getElementById("message");

  const hourNum = Number(hours);
  const minuteNum = Number(minutes);
  const totalMinutes = hourNum * 60 + minuteNum;
  const dayNum = now.getDay();

  if (dayNum >= 1 && dayNum <= 5) {

    if (range(totalMinutes,9,30,9,45)) {
      messageEl.textContent = "始まりの会";
    }

    else if (range(totalMinutes,9,45,10,30)) {
      messageEl.textContent = (dayNum===1) ? "コミュニティ活動" :
                              (dayNum===4) ? "キャンパス授業" :
                              "PBL";
    }

    else if (range(totalMinutes,10,30,10,35)) {
      messageEl.textContent = "残り5分となりました。日誌を記入してください";
    }

    else if (range(totalMinutes,10,45,11,30)) {
      messageEl.textContent = (dayNum===1) ? "コミュニティ活動" :
                              (dayNum===4) ? "キャンパス授業" :
                              "PBL";
    }

    else if (range(totalMinutes,11,30,11,35)) {
      messageEl.textContent = "残り5分となりました。日誌を記入してください";
    }

    else {
      showNextClass(messageEl, totalMinutes, dayNum);
    }

  } else {
    messageEl.textContent = "休日です";
  }

  const tzIdDisplay = document.getElementById('timezoneIdDisplay');
  tzIdDisplay.textContent = currentTimezone;
  tzIdDisplay.style.display = showTimezone ? 'block' : 'none';
}

/* =========================
   フルスクリーン
========================= */

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

/* =========================
   ループ
========================= */

function updateClockLoop() {
  const now = Date.now();

  if (timeUnit === "hm" && now - lastBlink >= 1000) {
    colonVisible = !colonVisible;
    lastBlink = now;
  }

  updateClock();
  requestAnimationFrame(updateClockLoop);
}

window.addEventListener("DOMContentLoaded", () => {
  updateClockLoop();
});
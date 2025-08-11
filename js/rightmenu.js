// 初始化函数
let yzf = {};
var readmode;

yzf.showRightMenu = function (isTrue, x = 0, y = 0) {
  let $rightMenu = $("#rightMenu");

  if (isTrue) {
    $rightMenu.css("top", x + "px").css("left", y + "px");
    $rightMenu.show();
  } else {
    $rightMenu.hide();
  }
};

// 复制当前选中文本
var selectTextNow = "";
document.onmouseup = document.ondbclick = selceText;
function selceText() {
  var txt;
  if (document.selection) {
    txt = document.selection.createRange().text;
  } else {
    txt = window.getSelection() + "";
  }
  if (txt) {
    selectTextNow = txt;
    // console.log(selectTextNow);
  } else {
    selectTextNow = "";
  }
}

window.oncontextmenu = function (event) {
  if ($("#rightMenu").is(":visible")) {
    RemoveRightMenu();
  } else {
    let $rightMenuCopyText = $("#menu-copytext");
    let $rightMenuPasteText = $("#menu-pastetext");
    let $rightMenuOther = $(".rightMenuOther");
    let $rightMenuCopyLink = $("#menu-copylink");
    let $rightMenuNewWindow = $("#menu-newwindow");
    let $rightMenuSearch = $(".menu-search");
    let $rightMenuCopyImg = $("#menu-copyimg");
    let $rightMenuDownloadImg = $("#menu-downloadimg");
    let $rightMenuReadmode = $("#menu-readmode");
    let href = event.target.href;
    let imgsrc = event.target.currentSrc;

    // 判断模式 扩展模式为有事件
    let pluginMode = false;
    globalEvent = event;
    $rightMenuOther.show();

    // 检查是否需要复制 是否有选中文本
    if (selectTextNow && window.getSelection()) {
      pluginMode = true;
      $rightMenuCopyText.show();
      $rightMenuSearch.show();
    } else {
      $rightMenuCopyText.hide();
      $rightMenuSearch.hide();
    }

    // 判断当前页面是否为文章
    if ($("thisisanarticle").length > 0 && $("thisisfof").length <= 0) {
      $rightMenuReadmode.show();
    } else {
      $rightMenuReadmode.hide();
    }

    // 判断是否为输入框
    if (event.target.tagName.toLowerCase() === "input" || event.target.tagName.toLowerCase() === "textarea") {
      pluginMode = true;
      $rightMenuPasteText.show();
    } else {
      $rightMenuPasteText.hide();
    }

    //检查是否右键点击了链接a标签
    if (href) {
      pluginMode = true;
      $rightMenuNewWindow.show();
      $rightMenuCopyLink.show();
      domhref = href;
    } else {
      $rightMenuNewWindow.hide();
      $rightMenuCopyLink.hide();
    }

    //检查是否需要复制图片
    if (imgsrc) {
      pluginMode = true;
      $rightMenuCopyImg.show();
      $rightMenuDownloadImg.show();
      domImgSrc = imgsrc;
    } else {
      $rightMenuCopyImg.hide();
      $rightMenuDownloadImg.hide();
    }

    // 如果不是扩展模式则隐藏扩展模块
    if (pluginMode) {
      $rightMenuOther.show();
    } else {
      $rightMenuOther.hide();
    }

    $(".rightMenu-line.rightMenu-music").html($(".aplayer-title").html());

    let yzfWidth = $("#rightMenu").width();
    let yzfHeight = $("#rightMenu").height();
    let pageX = event.clientX + 10; //加10是为了防止显示时鼠标遮在菜单上
    let pageY = event.clientY;

    // 鼠标默认显示在鼠标右下方，当鼠标靠右或考下时，将菜单显示在鼠标左方\上方
    if (pageX + yzfWidth > window.innerWidth) {
      pageX -= yzfWidth;
    }
    if (pageY + yzfHeight > window.innerHeight) {
      pageY -= pageY + yzfHeight - window.innerHeight;
    }

    yzf.showRightMenu(true, pageY, pageX);

    $("#rightmenu-mask").attr("style", "display: flex");
  }
  return false;
};

function RemoveRightMenu() {
  yzf.showRightMenu(false);
  $("#rightmenu-mask").attr("style", "display: none");
}

yzf.rightmenuCopyText = function (txt) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt);
  }
};

// 读取剪切板
yzf.readClipboard = function () {
  if (navigator.clipboard) {
    navigator.clipboard.readText().then((clipText) => yzf.insertAtCaret(globalEvent.target, clipText));
  }
};

// 粘贴文本到焦点
yzf.insertAtCaret = function (elemt, value) {
  const startPos = elemt.selectionStart,
    endPos = elemt.selectionEnd;
  if (document.selection) {
    elemt.focus();
    var sel = document.selection.createRange();
    sel.text = value;
    elemt.focus();
  } else {
    if (startPos || startPos == "0") {
      var scrollTop = elemt.scrollTop;
      elemt.value = elemt.value.substring(0, startPos) + value + elemt.value.substring(endPos, elemt.value.length);
      elemt.focus();
      elemt.selectionStart = startPos + value.length;
      elemt.selectionEnd = startPos + value.length;
      elemt.scrollTop = scrollTop;
    } else {
      elemt.value += value;
      elemt.focus();
    }
  }
};

//粘贴文本
yzf.pasteText = function () {
  const result = yzf.readClipboard() || "";
  RemoveRightMenu();
};

//分享链接
yzf.copyLink = function () {
  yzf.rightmenuCopyText(domhref);
  RemoveRightMenu();
};

// 下载图片状态
yzf.downloadimging = false;

yzf.downloadImage = function (imgsrc) {
  RemoveRightMenu();
  if (yzf.downloadimging == false) {
    yzf.downloadimging = true;
    a = document.createElement("a");
    var event = new MouseEvent("click");
    a.download = "";
    a.href = imgsrc;
    a.target = "_blank";
    a.dispatchEvent(event);
    yzf.downloadimging = false;
  }
};

// 复制图片到剪贴板
yzf.writeClipImg = function (imgsrc) {
  RemoveRightMenu();
  if (yzf.downloadimging == false) {
    yzf.downloadimging = true;
    copyImage(imgsrc);
    yzf.downloadimging = false;
  }
};

function imageToBlob(imageURL) {
  const img = new Image();
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  img.crossOrigin = "*";
  try {
    img.src = imageURL;
  } catch (error) {
    console.log(error);
  }
  return new Promise((resolve) => {
    img.onerror = function () {
      resolve(imageURL);
    };
    img.onload = function () {
      c.width = this.naturalWidth;
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      c.toBlob(
        (blob) => {
          // here the image is a blob
          resolve(blob);
        },
        "image/png",
        0.75
      );
    };
  });
}

async function copyImage(imageURL) {
  const blob = await imageToBlob(imageURL);
  let item;
  if (blob instanceof Blob) {
    item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
  } else {
    navigator.clipboard.writeText(imageURL);
  }
}

$("#menu-pastetext").on("click", yzf.pasteText);
$("#menu-backward").on("click", function () {
  window.history.back();
  RemoveRightMenu();
});
$("#menu-forward").on("click", function () {
  window.history.forward();
  RemoveRightMenu();
});
$("#menu-refresh").on("click", function () {
  window.location.reload();
  RemoveRightMenu();
});

yzf.switchDarkMode = function () {
  RemoveRightMenu();
  document.querySelector("a[title='主题切换']").click();
};

yzf.readmode = function () {
  if (readmode && !(new URLSearchParams(window.location.search).get("type") === "readmode")) {
    document.querySelector(".column-left").style = ``;
    document.querySelector(".column-right").style = ``;
    document.querySelector(".columns").style = ``;
    $("nav").css("display", "");
    $("footer").css("display", "");
    try {
      document.querySelector("#waline-thread").parentElement.parentElement.style.display = ``;
    } catch (error) {}
    $("#back-to-top").css("display", "");
    $("section").unbind("click");
    $(".column.column-main").addClass("is-8-tablet is-8-desktop is-6-widescreen");
    $(".column.column-main").removeClass("is-10-widescreen");
    readmode = false;
  } else {
    document.querySelector(".column-left").style = `display:none`;
    document.querySelector(".column-right").style = `display:none`;
    document.querySelector(".columns").style = `justify-content: center;`;
    $("nav").css("display", "none");
    $("footer").css("display", "none");
    try {
      document.querySelector("#waline-thread").parentElement.parentElement.style.display = `none`;
    } catch (error) {}
    $("#back-to-top").css("display", "none");
    $("section").on("click", function (e) {
      var e = e || window.event;
      var elem = e.target;
      if ($(elem).is(".columns .column") || $(elem).is(".columns .column *")) {
      } else {
        yzf.readmode();
      }
    });
    $(".column.column-main").removeClass("is-8-tablet is-8-desktop is-6-widescreen");
    $(".column.column-main").addClass("is-10-widescreen");
    readmode = true;
  }
};

$("#menu-darkmode").on("click", yzf.switchDarkMode);
$("#menu-up").on("click", function () {
  document.querySelector("#back-to-top").click();
  RemoveRightMenu();
});
$("#menu-copytext").on("click", function () {
  yzf.rightmenuCopyText(selectTextNow);
  RemoveRightMenu();
});
$("#menu-copylink").on("click", yzf.copyLink);
$("#menu-newwindow").on("click", function () {
  window.open(domhref);
  RemoveRightMenu();
});
$("#menu-about").on("click", () => {
  document.querySelector("a[href='/about/']").click();
  RemoveRightMenu();
});
$("#menu-links").on("click", () => {
  document.querySelector("a[href='/links/']").click();
  RemoveRightMenu();
});
$("#menu-lrc").on("click", () => {
  document.querySelector(".aplayer-icon.aplayer-icon-lrc").click();
  RemoveRightMenu();
});
$("#menu-startMic").on("click", () => {
  ap.play();
  RemoveRightMenu();
});
$("#menu-stopMic").on("click", () => {
  ap.pause();
  RemoveRightMenu();
});
$("#menu-nextMic").on("click", () => {
  addsong();
  ap.play();
  RemoveRightMenu();
});
$("#menu-downloadimg").on("click", function () {
  yzf.downloadImage(domImgSrc);
});
$("#menu-copyimg").on("click", function () {
  yzf.writeClipImg(domImgSrc);
});
$("#menu-search-baidu").on("click", function () {
  window.open("https://www.baidu.com/s?wd=" + selectTextNow);
  RemoveRightMenu();
});
$("#menu-search-bing").on("click", function () {
  window.open("https://cn.bing.com/search?q=" + selectTextNow);
  RemoveRightMenu();
});
$("#menu-readmode").on("click", function () {
  yzf.readmode();
  RemoveRightMenu();
});

if (new URLSearchParams(window.location.search).get("type") === "readmode" && $("thisisanarticle").length > 0 && $("thisisfof").length <= 0) {
  yzf.readmode();
  $("#rightMenu").remove();
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", async (e) => {
      const url = link.getAttribute("href");
      e.preventDefault();
      let a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.click();
    });
  });
}
// JavaScript Document

//向剪切板里放东西

function copy(txt) {
   var oA = document.createElement('a');
   oA['data-clipboard-text'] = txt;
   oA['class'] = "keyboadcur";
   oA.style.display = 'none';
   document.body.appendChild(oA);
   alert(document.querySelectorAll("#keyboadcur"));
   var t = new Clipboard(document.querySelectorAll("a"));
   t.on('success',function(e){
      document.body.removeChild(oA);
   });
   // if (window.clipboardData) {
   //  window.clipboardData.clearData();
   //  clipboardData.setData("Text", txt);
   //  //alert("复制成功！");
  
   // } else if (navigator.userAgent.indexOf("Opera") != -1) {
   //  window.location = txt;
   // } else if (window.netscape) {
   //  try {
   //   netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
   //  } catch (e) {
   //   //alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
   //  }
   //  var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
   //  if (!clip)
   //   return;
   //  var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
   //  if (!trans)
   //   return;
   //  trans.addDataFlavor("text/unicode");
   //  var str = new Object();
   //  var len = new Object();
   //  var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
   //  var copytext = txt;
   //  str.data = copytext;
   //  trans.setTransferData("text/unicode", str, copytext.length * 2);
   //  var clipid = Components.interfaces.nsIClipboard;
   //  if (!clip)
   //   return false;
   //  clip.setData(trans, null, clipid.kGlobalClipboard);
   //  //alert("复制成功！");
   // }
  }

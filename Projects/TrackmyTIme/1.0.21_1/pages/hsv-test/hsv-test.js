function drawPalette(colors, prefix, palletteName){

  // pallette name
  $("<h1/>")
    .addClass("title")
    .text(palletteName)
    .appendTo("body");

  // add a swatch for each color
  for (var i = 0; i < colors.length; i++) {

    $("<div/>")
      .css('background-color', colors[i])
      .append($("<span/>").text(colors[i]))
      .appendTo("body");
  }
}

// Kelly
var kelly = [
  /*___RED___*/   "#CD5C5C","#F08080","#FA8072","#E9967A","#FFA07A","#DC143C","#FF0000","#B22222",
                  // "#8B0000",
  /*___PINK___*/  "#FFC0CB","#FF69B4","#FF1493","#C71585","#DB7093",
  /*___ORANGE___*/"#FF7F50","#FF6347","#FF4500","#FF8C00","#FFA500",
  /*___YELLOW___*/"#FFD700","#FFFF00","#FFFACD","#FAFAD2","#FFEFD5","#FFE4B5","#FFDAB9","#EEE8AA","#F0E68C",
  /*___VIOLET___*/"#E6E6FA","#D8BFD8","#DDA0DD","#EE82EE","#DA70D6","#FF00FF","#BA55D3","#9370DB","#8A2BE2","#9400D3",
                  "#800080","#4B0082","#6A5ACD","#483D8B",
  /*___GREEN___*/ "#ADFF2F","#32CD32","#98FB98","#90EE90","#00FA9A","#00FF7F","#3CB371","#2E8B57","#228B22","#006400",
                  "#9ACD32","#6B8E23","#808000","#556B2F","#66CDAA","#8FBC8F","#20B2AA","#008B8B",
  /*___BLUE___*/  "#00FFFF","#E0FFFF","#AFEEEE","#7FFFD4","#40E0D0","#00CED1","#5F9EA0","#4682B4","#B0C4DE","#B0E0E6",
                  "#ADD8E6","#87CEEB","#00BFFF","#1E90FF","#6495ED","#7B68EE","#4169E1","#0000FF","#0000CD","#00008B",
                  // "#191970",
  /*___BROWN___*/ "#FFEBCD","#FFDEAD","#F5DEB3","#DEB887","#D2B48C","#BC8F8F","#F4A460","#A0522D","#A52A2A",
                  // "#800000",
  // /*___WHITE___*/ "#F0F8FF","#FFF5EE","#F5F5DC","#FAEBD7","#FAF0E6","#FFE4E1",
  /*___GRAY___*/  "#DCDCDC","#D3D3D3","#C0C0C0","#A9A9A9","#808080","#696969","#778899","#2F4F4F"
];
drawPalette(kelly, "", "System colors (" + kelly.length + ")");


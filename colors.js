var Border = {
  setColor: function (color) {
    document.querySelector("#grid ol").style.borderColor = color;
    document.querySelector("h1").style.borderColor = color;
  },
};
var Link = {
  setColor: function (color) {
    var alist = document.querySelectorAll("a");
    var i = 0;
    while (i < alist.length) {
      console.log(alist[i]);
      alist[i].style.color = color;
      i = i + 1;
    }
  },
};
var Body = {
  setColor: function (color) {
    document.querySelector("body").style.color = color;
  },
  setBackgroundColor: function (color) {
    document.querySelector("body").style.backgroundColor = color;
  },
};

function nightDayHandler(self) {
  var target = document.querySelector("body");
  if (self.value === "night") {
    self.value = "day";
    Body.setBackgroundColor("black");
    Body.setColor("white");
    Border.setColor("white");
    Link.setColor("white");
  } else {
    self.value = "night";
    Body.setBackgroundColor("white");
    Body.setColor("black");
    Border.setColor("black");
    Link.setColor("black");
  }
}

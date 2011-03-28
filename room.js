var Room = function(title, desc, exits) {
  var _title = "";
  var _desc = "";
  var _exits = [];

  var format_exits = function() {
    _exits.join(" ");
  };

  var display = function() {
    return "\n"
      + _title
      + "\n"
      + _desc
      + "\n"
      + format_exits;
  };
};

module.exports = Room;
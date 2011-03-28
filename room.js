var Room = function(title, desc, exits) {
  this.title = title;
  this.desc = desc;
  this.exits = exits;

  this.format_exits = function() {
    return this.exits.join(", ");
  };

  this.display = function() {
    return "\n"
      + this.title
      + "\n"
      + this.desc
      + "\n"
      + this.format_exits();
  };
};

module.exports = Room;
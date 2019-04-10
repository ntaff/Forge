module.exports = class Points {

  constructor(listP)
  {
    this.listPoints = [];
  }

  setPoints(points)
  {
    for (var i in points)
    {
      this.listPoints.push(points[i]);
    }
  }

}

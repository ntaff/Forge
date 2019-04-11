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
    this.currentListPoints = this.listPoints;
  }

  selectPoints(fastfoods)
  {
    if(!Array.isArray(fastfoods))
    {
      fastfoods = [fastfoods];
    }
    this.currentListPoints = []
    for (var i in fastfoods)
    {
      for (var j in this.listPoints)
      {
        if(this.listPoints[j].Name == fastfoods[i])
        {
          this.currentListPoints.push(this.listPoints[j]);
        }
      }
    }
  }

}

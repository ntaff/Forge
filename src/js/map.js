 var map;
      function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.918986 , lng: 2.138034},
        zoom: 13
      });
      
      var marker = new google.maps.Marker({
      position: {lat: 43.918986, lng: 2.138034},
      map: map,
      title: 'Albi'
      });
      
      marker.setMap(map);
      
      $.ajax({
        url: '../data/burgerking.csv',
        dataType: 'text',
      }).done(successFunctionBK);
      
      function successFunctionBK(data) {
        var allRows = data.split(/\r?\n|\r/);
        for (var singleRow = 0; singleRow < allRows.length; singleRow++) 
        {    
          var rowCells = allRows[singleRow].split(',');
          for (var rowCell = 0; rowCell < rowCells.length; rowCell=rowCell+2) 
          {
            var marker = new google.maps.Marker({
              position: {lat: parseFloat(rowCells[rowCell+1]) , lng: parseFloat(rowCells[rowCell])},
              map: map,
              title: 'BurgerKing'
              });
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
            marker.setMap(map);
            
            //console.log(parseFloat(rowCells[rowCell]));
            //console.log(rowCells[rowCell+1]);
          }
        } 
      }
      
      $.ajax({
        url: '../data/macdonalds.csv',
        dataType: 'text',
      }).done(successFunctionM);
      
      function successFunctionM(data) {
        var allRows = data.split(/\r?\n|\r/);
        for (var singleRow = 0; singleRow < allRows.length; singleRow++) 
        {    
          var rowCells = allRows[singleRow].split(',');
          for (var rowCell = 0; rowCell < rowCells.length; rowCell=rowCell+2) 
          {
            var marker = new google.maps.Marker({
              position: {lat: parseFloat(rowCells[rowCell]) , lng: parseFloat(rowCells[rowCell+1])},
              map: map,
              title: 'Mcdo'
              });
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
            marker.setMap(map);
            
            //console.log(parseFloat(rowCells[rowCell]));
            //console.log(rowCells[rowCell+1]);
          }
        } 
      }     
      
      $.ajax({
        url: "../data/McDonald's Europe.csv",
        dataType: 'text',
      }).done(successFunctionMEU);
      
      function successFunctionMEU(data) {
        var allRows = data.split(/\r?\n|\r/);
        for (var singleRow = 0; singleRow < allRows.length; singleRow++) 
        {    
          var rowCells = allRows[singleRow].split(',');
          for (var rowCell = 0; rowCell < rowCells.length; rowCell=rowCell+4) 
          {
            var marker = new google.maps.Marker({
              position: {lat: parseFloat(rowCells[rowCell+1]) , lng: parseFloat(rowCells[rowCell])},
              map: map,
              title: 'Mcdo'
              });
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
            marker.setMap(map);
            
            //console.log(parseFloat(rowCells[rowCell]));
            //console.log(rowCells[rowCell+1]);
          }
        } 
      }
    }  

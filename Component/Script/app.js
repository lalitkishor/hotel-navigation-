var map;
var hotelPlaces;
var infoWindow;
var model;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 25.0000, lng: 72.0000},
    zoom: 5 ,
    mapTypeControlOptions: {
     style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
     position: google.maps.ControlPosition.TOP_RIGHT
   }
  });
  infoWindow = new google.maps.InfoWindow({content: ""});
  hotelPlaces = [
    {
      title: "The Laxmi Niwas Palace",
      marker: new google.maps.Marker({position: {lat: 22.695547, lng: 75.894345}, map: map, animation: google.maps.Animation.DROP}),
      description :"5 Star hotel and currently wiki page is not available",
    },
    {
      title: "The Taj Mahal Palace Hotel",
      marker: new google.maps.Marker({position: {lat: 18.921978, lng: 72.833044}, map: map, animation: google.maps.Animation.DROP}),
      description :"present in mumbai and currently wiki page is not available",
    },
    {
      title: "The Leela Palaces, Hotels and Resorts",
      marker: new google.maps.Marker({position: {lat: 18.921978, lng: 72.833044}, map: map, animation: google.maps.Animation.DROP}),
      description :"Set in a grand palace with an ornate, sandstone exterior, this palatial luxury hotel is 7 km from the abandoned village of Kuldhara, and 15 km from the Bara Bagh temple",
    },
    {
      title: "taj lake palace",
      marker: new google.maps.Marker({position: {lat: 24.585445, lng: 73.712479}, map: map, animation: google.maps.Animation.DROP}),
      description :"Lake Palace is a luxury hotel, which has 83 rooms and suites featuring white marble walls and currently wiki page is not available",
    },
    {
      title: "Hotel Hillock",
      marker: new google.maps.Marker({position: {lat: 24.592591, lng: 72.715627}, map: map, animation: google.maps.Animation.DROP}),
      description :"3 Star hotel in mountabu and currently wiki page is not available",
    },
  ];

  model = new ViewModel();
  ko.applyBindings(model);

hotelPlaces.forEach(function(p) {
    p.marker.addListener('click', function() {
      model.onPlaceClicked(p);
    });
  });

  drawMarker();
}

function drawMarker(all) {
  var arr = hotelPlaces;

  for(var i=0; i < arr.length; i++) {
    if(all || arr[i].title.toLowerCase().match(model.queryre())) {
      arr[i].marker.setVisible(true);
    }
    else {
      arr[i].marker.setVisible(false);
    }
  }
}



var ViewModel = function() {
  this.query  = ko.observable("");
  this.queryre = ko.computed(function() {
    return new RegExp(".*" + this.query().toLowerCase() + ".*");
  }, this);

  this.listhotel = ko.computed(function() {
    if(!this.query()){
      drawMarker(true);
      return hotelPlaces;
    }
    else {
      var re = this.queryre();
      return ko.utils.arrayFilter(hotelPlaces, function(hotelPlaces) {
        drawMarker(false);
        return hotelPlaces.title.toLowerCase().match(re);
      });
    }
  }, this);

 this.onPlaceClicked = function(hotelPlace) {
   if(hotelPlace.marker.getAnimation() !== null)
     hotelPlace.marker.setAnimation(null);
   else {
     hotelPlaces.forEach(function(d) {
       d.marker.setAnimation(null);
     });
     hotelPlace.marker.setAnimation(google.maps.Animation.BOUNCE);
   }

    map.setZoom(8);
    map.panTo(hotelPlace.marker.getPosition());
//console.log(hotelPlace.title);
    if(!hotelPlace.desc){
      $.ajax({
        url:"https://en.wikipedia.org/w/api.php?action=opensearch&search="+ hotelPlace.title +"&format=json",
        dataType: "jsonp"
      })
      .done(function(data) {
        var title = data[0];
        var content = data[2][0];

        if(!content) {
          content = hotelPlace.description;
        }

        var contentString = "<h3>" + title + "</h3><br><p>" + content + "</p>";
        hotelPlace.desc = contentString; //caching the result
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({content: hotelPlace.desc});
        infoWindow.open(map, hotelPlace.marker);
      })
      .fail(function(err) {
        alert("Oh! something went wrong!");
      })
    } else {
      infoWindow.close();
      infoWindow = new google.maps.InfoWindow({content: hotelPlaces.desc});
      infoWindow.open(map, hotelPlaces.marker);
    }
  }
  this.openNav = function() {
     document.getElementById("side-nav").style.width = "250px";
 };

 this.closeNav = function() {
     document.getElementById("side-nav").style.width = "0px";
 };

};

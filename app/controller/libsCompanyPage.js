// Datetimepicker
var picker = new Pikaday({
disableDayFn: function(date){
    // Disable Monday
    return date.getDay() === 1;
},
field: $('#datepicker')[0] });

$(document).ready(function(){
    // use settings from the input's attributes (from the html5 spec)
    // 30 min intervals
    $("input[name='myTime']").timeInput();
});

// Gallery
$(document).ready(function(){

    $(".preview a").on("click", function(){
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
        var picture = $(this).data();

        event.preventDefault();

        $(".full img").fadeOut( 100, function() {
          $(".full img").attr("src", picture.full);
          $(".full").attr("href", picture.full);
          $(".full").attr("title", picture.title);

      }).fadeIn();
    });

    $(".full").fancybox({
        helpers : {
            title: {
                type: 'inside'
            }
        },
        closeBtn : true,
    });
});

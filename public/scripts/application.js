 $(document).ready(function(){
      var $list = $('#List');
      
      $("#submit").click(function(event){
        $("#spinner").show();
        event.preventDefault();
        $("ul").empty();
        $.get("/search",{q:$("#query").val()},function(response){
          $("#spinner").hide();
          $.each(response.data, function(i, src) {
            var $li = $('<li class="loading">').appendTo($list);
            $('<img>').appendTo($li).on('load', function() {
                $li.removeClass('loading');
            }).attr('src', src);
          });
        })
      });

      $("#keywords").click(function(){
        $("ul").empty();
        $.get("/keywordList",function(response){
          $.each(response.data, function(i, keyword) {
          var $li = $('<li>').appendTo($list);
          $("<a href='#'>"+ keyword + "</a>").appendTo($li).attr('id', keyword);
         });
        });
      });

      $(document).on('click','li a',function(e){
        e.preventDefault();
        $("ul").empty();
        var data = $(this).attr('id');
        $.get("/getImages",{keyword:data},function(response){
          $.each(response.data, function(i, src) {
            var $li = $('<li class="loading">').appendTo($list);
            $('<img>').appendTo($li).on('load', function() {
              $li.removeClass('loading');
            }).attr('src', "/getImage/"+src);
          });
        });
      });
    });
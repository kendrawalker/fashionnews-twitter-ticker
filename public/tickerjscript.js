
$.ajax({
    "url": "/tweets",
    "success": function(data){
        var html ='';
        var coffeeLink;

        for(var i =0; i<data.length; i++) {
            html += '<a class="coffeelink" href="' + data[i].url + '">' + data[i].text + '</a>';
        }

        var coffeeHeadlines = $('#coffeeheadlines');
        coffeeHeadlines.html(html);
        coffeeLink = $('.coffeelink');
        var curLeft = coffeeLink.offset().left;
        var firstLink = coffeeLink.eq(0);
        var firstLinkWidth = firstLink.outerWidth();
        var offPageAllowance = -firstLinkWidth;

        function animId() {
            requestAnimationFrame(function moveCoffee() {
                curLeft--;
                coffeeHeadlines.css({
                    left: curLeft + 'px'
                });
                if(curLeft<offPageAllowance){
                    coffeeHeadlines.append(firstLink);
                    curLeft+=firstLinkWidth;
                    coffeeLink = $('.coffeelink');
                    firstLink = coffeeLink.eq(0);
                    firstLinkWidth = firstLink.outerWidth();
                    offPageAllowance = -firstLinkWidth;
                    coffeeHeadlines.css({
                        left: curLeft + 'px'
                    });
                }

                requestAnimationFrame(moveCoffee);
            });
        }
        animId();
    }
});

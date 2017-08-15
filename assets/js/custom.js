(function($) {

    /* ---------------------------------------------- /*
     * Preloader
    /* ---------------------------------------------- */

    $(window).load(function() {
        $('#status').fadeOut();
        $('#preloader').delay(300).fadeOut('slow');
    });

    $(document).ready(function() {

        /* ---------------------------------------------- /*
         * Smooth scroll / Scroll To Top
        /* ---------------------------------------------- */

        $('a[href*=#]').bind("click", function(e) {

            var anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $(anchor.attr('href')).offset().top
            }, 1000);
            e.preventDefault();
        });

        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.scroll-up').fadeIn();
            } else {
                $('.scroll-up').fadeOut();
            }
        });

        /* ---------------------------------------------- /*
         * Navbar
        /* ---------------------------------------------- */

        $('.header').sticky({
            topSpacing: 0
        });

        $('body').scrollspy({
            target: '.navbar-custom',
            offset: 70
        })


        /* ---------------------------------------------- /*
         * Home BG
        /* ---------------------------------------------- */

        $(".screen-height").height($(window).height());

        $(window).resize(function() {
            $(".screen-height").height($(window).height());
        });

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('#home').css({
                'background-attachment': 'scroll'
            });
        } else {
            $('#home').parallax('50%', 0.1);
        }


        /* ---------------------------------------------- /*
         * WOW Animation When You Scroll
        /* ---------------------------------------------- */

        wow = new WOW({
            mobile: false
        });
        wow.init();
    });

})(jQuery);


$(function() {

    $('#nojs').hide()

    function render(id, frames) {
        var el = $('#' + id),
            data = $('<div></div>').appendTo(el)
        el.addClass('example')

        function display(index) {
            var html = '',
                frame = frames[index]
            for (var i = 0; i < frame.array.length; i++) {
                var classes = ['number']
                if (frame.sorted && frame.sorted[i]) classes.push('sorted')
                if (frame.classes && frame.classes[i] != null) {
                    classes.push(frame.classes[i])
                } else if (frame.active) {
                    var active = frame.active
                    if (active.pivot != null) {
                        var pivot = active.pivot
                        if (i == pivot) classes.push('pivot')
                        else if (active.partitioned) {
                            if (i < pivot) classes.push('before-pivot')
                            if (i > pivot) classes.push('after-pivot')
                        } else {
                            if (frame.opened) {
                                if (i < frame.opened[0] || i >= frame.opened[1]) {
                                    classes.push('closed')
                                } else {
                                    classes.push('after-pivot')
                                }
                            }
                        }
                    }
                }
                if (frame.stack && frame.stack.length > 0) {
                    var top = frame.stack[frame.stack.length - 1]
                    if (i < top[0] || i >= top[1]) classes.push('offstack')
                }
                html += '<span class="' + classes.join(' ') + '">' + frame.array[i] + '</span>'
            }

            function size(z) {
                return 46 * z + 'px'
            }
            var addendum = false
            if (frame.stack || frame.description) addendum = true
            if (addendum) html += '<div class="addendum">'
            if (frame.stack) {
                html += '<div class="stacks">'
                for (var j = frame.stack.length - 1; j >= 0; j--) {
                    var sf = frame.stack[j],
                        style = 'width: ' + size(sf[1] - sf[0]) + '; margin-left: ' + size(sf[0]) + '; margin-right: ' + size(frame.array.length - sf[1])
                    html += '<div class="stack-frame' + (j < frame.stack.length - 1 ? ' inactive' : '') + '"><div class="stack-bound" style="' + style + '"></div></div>'
                }
                html += '</div>'
            }
            if (frame.description) {
                html += '<p class="description">' + '<b> ( ' + (index + 1) + ' / ' + frames.length + ' ) </b><br>' + frame.description + '</p>'
            }
            if (addendum) html += '</div>'
            data.html(html)
        }
        display(0)
        var frameManager = {
            frame: 0,
            next: function() {
                this.go(this.frame + 1)
            },
            go: function(frame) {
                this.frame = frame
                display(this.frame)
            }
        }
        if (frames.length > 1) {
            $('<div class="slider"></div>').prependTo(el).slider({
                min: 0,
                max: frames.length - 1
            }).on('slide', function(event, ui) {
                frameManager.go(ui.value)
            })
        }
    }

    var array = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

    render('ex1', [{
        array: array.slice()
    }]);
    (function() {
        var a = array.slice(),
            all = {}
        a.sort(function(x, y) {
            return x - y;
        })
        for (var i = 0; i < a.length; i++) all[i] = true
        render('ex2', [{
            array: a.slice(),
            sorted: all
        }])
    })()

    function doQuickSort(array, id, randomPivot, showPartition) {
        var a = array.slice(),
            o = [],
            stack = [],
            sorted = [],
            partitioning

        function show(description, active) {
            var all = {},
                classes = {}
            if (partitioning != null) classes[partitioning] = 'partitioning'
            for (var i = 0; i < sorted.length; i++) all[sorted[i]] = true
            o.push({
                array: a.slice(),
                description: description,
                active: active,
                stack: stack.slice(),
                sorted: all,
                classes: classes
            })
        }
        show('This is the array to sort')

        function swap(x, y) {
            var c = a[x]
            a[x] = a[y]
            a[y] = c
        }

        function partition(lower, upper, pivot) {
            var left = lower,
                right = lower

            function report() {
                if (showPartition) {
                    partitioning = right - 1
                    show('[Partitioning steps...]', {
                        pivot: pivot
                    })
                    partitioning = null
                }
            }
            while (right < upper) {
                right++
                if (a[right - 1] < a[pivot]) {
                    swap(right - 1, left)
                    left++
                }
                report()
            }
            return left
        }

        function quicksort(lower, upper, cb) {
            if (lower >= upper) return
            stack.push([lower, upper])
            var noun = stack.length > 1 ? 'sub-array' : 'array'
            if (cb) cb()
            if (lower + 1 == upper) {
                sorted.push(lower)
                show('Since there is only one element in this ' + noun + ',<br>we consider that only element "sorted."')
                stack.pop()
                return
            }
            if (randomPivot) {
                var rand = (function() {
                    // we will cheat and just pick the median
                    var b = a.slice(lower, upper)
                    b.sort(function(x, y) {
                        return x - y;
                    })
                    var d = b[Math.floor(b.length / 2)]
                    for (var k = lower; k < upper; k++)
                        if (a[k] == d) return k
                })()
                var pivot = a[rand]
                show('Pick a pivot. The pivot (' + pivot + ') is highlighted in green.', {
                    pivot: rand
                })
                swap(rand, lower)
                show('The pivot is swapped with the leftmost element.', {
                    pivot: lower
                })
            } else {
                var pivot = a[lower]
                show('Pick a pivot. The pivot (' + pivot + ') is highlighted in green.', {
                    pivot: lower
                })
            }
            var right = partition(lower + 1, upper, lower)
            swap(lower, right - 1)
            if (showPartition && lower != right - 1) show('[Partitioning steps...]', {
                pivot: right - 1
            })

            var descs = []
            descs.push(lower == right - 1 ? 'There are no more elements less than the pivot.' :
                'All elements less than the pivot are in the left part.')
            descs.push(right - 1 == upper - 1 ? 'There are no more elements greater than or equal to than the pivot.' :
                'All elements greater than or equal to the pivot are in the right part.')

            show('Partition the ' + noun + '. ' + descs.join('<br>'), {
                pivot: right - 1,
                partitioned: true
            })
            sorted.push(right - 1)
            show('The pivot is now considered "sorted".')
            quicksort(lower, right - 1, function() {
                show('We now do quicksort on the left sub-array.')
            })
            quicksort(right, upper, function() {
                show('We now do quicksort on the right sub-array')
            })
            show('Coming back, we see that this ' + noun + ' is sorted.' + (stack.length == 1 ? '<br>Done.' : ''))
            stack.pop()
        }
        quicksort(0, a.length)
        render(id, o)
    }

    doQuickSort(array, 'ex3')
    var down = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    doQuickSort(down, 'ex5', false, true)
    doQuickSort(down, 'ex6', true, true)

    ;
    (function() {
        var a = array.slice(),
            o = [],
            pivot, opened, beforePivot, normalCard, justClosed

        function show(description) {
            var classes = {}
            if (justClosed != null) classes[justClosed] = 'just-closed'
            if (beforePivot != null) classes[beforePivot] = 'before-pivot'
            if (normalCard != null) classes[normalCard] = 'number'
            o.push({
                array: a.slice(),
                description: description,
                active: {
                    pivot: pivot
                },
                opened: opened ? opened.slice() : null,
                classes: classes
            })
        }
        show('This is the array to partition.')

        pivot = 0
        show('Assume that the pivot is the leftmost element (' + a[0] + ').')

        opened = [1, 1]
        show('Flip all the other cards down.')

        function swap(x, y) {
            var c = a[x]
            a[x] = a[y]
            a[y] = c
        }

        function partition(lower, upper) {
            var left = lower + 1,
                right = lower + 1
            pivot = lower
            while (right < upper) {
                right++
                opened = [left, right]
                normalCard = right - 1
                show('Open the next card...')
                normalCard = null
                if (a[right - 1] < a[pivot]) {
                    var old = a[right - 1],
                        neu = a[left],
                        selfSwap = right - 1 == left
                    beforePivot = right - 1
                    show('...but ' + old + ' is less than the pivot (' + a[pivot] + ').')
                    swap(right - 1, left)
                    beforePivot = left
                    show('So we swap it with the first opened card (' + (selfSwap ? 'itself' : neu) + ').')
                    left++
                    opened = [left, right]
                    justClosed = beforePivot
                    beforePivot = null
                    show('Then we close that card.')
                } else {
                    show('...' + a[right - 1] + ' is greater than or equals to the pivot (' + a[pivot] + ').<br>Everything is good.')
                }
            }
            swap(pivot, left - 1)
            pivot = left - 1
            justClosed = 0
            if (pivot == 0) justClosed = null
            show('Now that we\'ve opened all cards, <br>swap the last closed card with the pivot.')
            var description = 'Re-open the closed card, you\'ll see that the array is partitioned!'
            o.push({
                array: a.slice(),
                description: description,
                active: {
                    pivot: pivot,
                    partitioned: true
                }
            })
        }

        partition(0, a.length)

        render('ex4', o)
    })()

})

    $(document).ready(function() {

        $('#multiple-checkboxes').multiselect();

    });

   $("#dist").slider({
    ticks: [0, 10, 50, 100, 500, 1000],
    ticks_positions: [0, 20, 40, 60, 80, 100],
    ticks_labels: ['$0', '$10', '$50', '$100', '$500', '$1000'],
    ticks_snap_bounds: 30
});

$(function() {

    $(".member-remove").click(function() {
        var $this = $(this);

        $("#rtm-email").text($this.data("email"));
        $("#remove-team-member-email").val($this.data("email"));
        $('#remove-team-member-modal').modal("show");

        return false;
    });

    $("#showMyLabels").click(function(event) {
        var button = $("#showradiobuttons");
       if(event.target.checked){
            button.show()
            //avoid executing the hiding line below
            return;
       }

       //uncheck any checked radio buttons
        $(".report_buttons").each(function(index, element){
            element.checked = false;
        });
        //hide the radio buttons
        button.hide()
    });

});

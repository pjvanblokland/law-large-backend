$(function() {
    
     $("#dialog-lootjes").dialog({
         resizable: true,
         height: 500,
         width: 700,
         modal: true,
         autoOpen: false
     });
	 $("#dialog-internet").dialog({
         resizable: true,
         height: 300,
         width: 500,
         modal: true,
         autoOpen: false
     });
     $("#dialog-tooninfo").dialog({
         resizable: true,
         height: 300,
         width: 400,
         modal: false,
         autoOpen: false
     });
     $("#dialog-code").dialog({
            resizable: true,
            height: 400,
            width: 500,
            modal: true,
            autoOpen: false
        });
});
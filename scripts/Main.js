
$( document ).ready(function() {

 $('#mainSplitter').jqxSplitter({  theme:'ui-start',  width: '100%', height: 690, panels: [{ size: '40%'}, {size: '60%'}] });
 $('#mainSplitter').jqxSplitter({ resizable: true });

    /**********************************************************************************************************************
                                                                            Global vaiables and functions
     **********************************************************************************************************************/
    //var url ="../sampledata/order.xml";
    var gWebURL = 'http://localhost:3010';  //<-- Webserver URL for all ajax calls

    //var gWebURL = settings.gWebURL;  //<-- Webserver URL for all ajax calls
   // var gID2Save = null ;
    var userid=  userName;

    //InitLoad(userid);

    /**********************************************************************************************************************
                                                                        FUNCTION CALLS
     **********************************************************************************************************************/
     /*===================================================================================
     Function: InitLoad
     Purpose: Populates application data.
     Last Modified:
     ===================================================================================*/
/*    function InitLoad(userid){
        console.log('Inside Public script: Call InitLoad')

        //LoadDemoGrid(url);
       $.post( gWebURL + '/InitLoad', {userid: userid } )
        .done( function( data) {
            if ( data ){

                $("#source").change(function() {

                    var el = $(this) ;

                    if(el.val() === "Make Model Year" ) {
                        LoadSelectGrid1(data[0], el.val(), false);
                        $('#ButtonPanel1').css("display", "inline");
                    }
                    else if(el.val() === "Featured Reviews" ) {

                        LoadSelectGrid1(data[1], el.val(), true);
                        $('#ButtonPanel1').css("display", "inline");
                    }
                });
                LoadSelectGrid(data[2],userid);
                $('#ButtonPanel3').css("display", "inline");

            }
          })

       .fail( function(xhr) {
              showMsgPanel('Warning', xhr.responseText );
        });


    }

*/





//Refresh Web Page on click
    $('#refresh').click(function() {
        location.reload();


    });

//Submit on click
    $('#submitButton').click(function() {

            $('#jqxPanel').jqxPanel('clearcontent');

        $.post( gWebURL + '/sendEmailConfirmation', {userid: userid} )

            .done( function( data) {
                if ( data ){

                   // $('#Alert').css("display", "inline");
                    var obj = JSON.parse(JSON.stringify(data[0][0]));
                    //$('#txtOrderId').val(obj.insertid)  ;
                    //showMsgPanel('Please check your email for confirmation. Thanks! Your Order ID:', obj.insertid );
                    //window.confirm("Please check your email for confirmation. Thanks! Your Order ID:"+obj.insertid);
                    /*$.dialog({
                        title: 'Order Submitted.',
                        content: 'OrderID'+obj.insertid+'Please check your email for confirmation. Thanks!',
                    });*/
                    //location.reload();
                    if (obj.insertid == null){
                        jqxAlert.alert('Sorry! Order Cart is Empty');
                    }else {
                        jqxAlert.alert('New Order # ' + obj.insertid + '. Please check your email for confirmation. Thanks!');
                    }
                }
            })

            .fail( function(xhr) {
                showMsgPanel('Warning', xhr.responseText );
            });
        //Disable the Submit button to create duplicate record
        //$(this).prop("disabled",true);  // Prevent additional clicks while this process is completing
        //if (Submit() == 'Disabled' ) {return; }
        //$(this).prop("disabled",false);  //Restore normal use of this button



    });
    //Cancel All Orders
    $("#cancelButton").on('click', function () {

        /* var txt;
         var r = confirm("Delete all selected items under Saved Order Screen?");
         if (r == true) {*/
        //alert( " Selected Rows:" + selectecrow + " By User:"+userid);
        $.post( gWebURL + '/deleteAllItemsSelected', {userid: userid })
            .done( function( data) {
                if ( data ){


                    $('#jqxPanel').jqxPanel('clearcontent');
                    LoadSelectGrid(data[0],userid);
                    //selectedrow = null;
                    //$('#ButtonPanel3').css("display", "inline");
                    $("#cancelButton").off("click");

                }
            })

            .fail( function(xhr) {
                showMsgPanel('Warning', xhr.responseText );
            });
        /* } else {
         return false;
         }*/






        //$("#addButton").off("click");
    });



    /*===================================================================================
    Function: UserId Click event
    Purpose:  Shows "Logout" option
    Last Modified:
    ===================================================================================*/
    $( "#lblUserId" ).click(function() {
        $('#spnLogOff').css('display', 'inline-block');
    });

    /**********************************************************************************************************************
     BUTTON CLICK EVENTS
     **********************************************************************************************************************/
    /*===================================================================================
     Function: Reset button Click-event
     Purpose: Calls Reset function
     Last Modified:
     ===================================================================================*/
    $( "#btnReset" ).click(function() {
        Reset();
    });
      /*===================================================================================
     Function: btnSave Event
     Purpose: Save user data to the server
     Last Modified:
     ===================================================================================*/
    $('#btnSave').click(function() {
        
        $(this).prop("disabled",true);  // Prevent additional clicks while this process is completing
        if (Save() == 'Disabled' ) {return; }
       $(this).prop("disabled",false);  //Restore normal use of this button    
       
    });
    /*===================================================================================
     Function: showMsgPanel
     Purpose:  Display messages (replacement for Alert)
     Last Modified:
     ===================================================================================*/
    function showMsgPanel(Importance, Message){

        $('#MsgPanelContainer').removeClass('w3-pale-red w3-pale-yellow w3-pale-green');

        switch( Importance ){
            case 'Warning':
                $('#MsgPanelContainer').addClass('w3-pale-red');
                break;

            case 'Info':
                $('#MsgPanelContainer').addClass('w3-pale-yellow');
                break;

            case 'Success':
                $('#MsgPanelContainer').addClass('w3-light-blue');
                break;
        }

        $('#spnMsgPanelBody').html(Message);
        $('#MsgPanel').css('display', 'block');
    }
   /*===================================================================================
     Function: MsgPanelBtn-Click
     Purpose: Hides the Message panel by clicking the X button.
     Last Modified:
     ===================================================================================*/
    $('#MsgPanelBtn').click(function() {
        $('#MsgPanel').css('display', 'none');
    });






}) //<-- /Doc Ready

$( document ).ready(function() {

    //  $.ajaxSetup({xhrFields: { withCredentials: true } });


    /**********************************************************************************************************************
     Global vaiables and functions
     **********************************************************************************************************************/

    var gWebURL = 'http://localhost:3010';  //<-- Webserver URL for all ajax calls

    Load();

    /**********************************************************************************************************************
     FUNCTION CALLS
     **********************************************************************************************************************/
    /*===================================================================================
     Function: InitLoad
     Purpose: Populate application data.
     Last Modified:
     ===================================================================================*/
    function Load(){

        $.post( gWebURL + '/forgot')
            .done( function( data) {
                if ( data ){
                    PopulateAdvDD(data[0]);
                    PopulateAgyDD(data[1]);
                    //Render the grids with no data
                    LoadOrderGrid(null);
                    LoadResultsGrid(null);
                    LoadSelectGrid(null);
                }
            })

            .fail( function(xhr) {
                showMsgPanel('Warning', xhr.responseText );
            });


    }
    /*===================================================================================
     Function: getBaseDeadlines
     Purpose: This is called during page loading, it pulls the 3 default deadline day values.
     Last Modified:
     ===================================================================================*/
    function getBaseDeadlines(){

        $.post( gWebURL + '/GetBaseDeadlines' )
            .done( function(data) {
                var Deadlines = data[0][0];

                $('#txtMonFri').val(Deadlines.MON2FRI);
                $('#txtSaturday').val(Deadlines.SAT);
                $('#txtSunday').val(Deadlines.SUN);
            })
            .fail( function(xhr) {

                showMsgPanel('Warning',xhr.responseText);
            });
    }

    /*===================================================================================
     Function: UpdateDeadlines
     Purpose: Allows updating the number of days before the insert date to set the deadline and the option to set the deadline for a specific date. \
     Also the the 3 standard deadlines can me modified.
     Last Modified:
     ===================================================================================*/
    function UpdateDeadlines(){

        var rtnData = null;

        var Input = $('#txtSpecialNumDays').val() +$('#txtMonFri').val()+$('#txtSaturday').val()+$('#txtSunday').val() ;  //<-- Concat the numeric values
        if ( /\D/.test(Input) == true){                                                                                                               //<-- If test is true, then non-numeric values exists.
            showMsgPanel('Warning', 'All values must be numeric, no characters or spaces allowed. Please check you input values before saving.') ;
            return;
        }

        var parms = [];
        var parm = {};
        parm.name = 'SpecialDate';
        parm.value = ( $('#txtSpecialDate').val() == null ? 'null' : $('#txtSpecialDate').val() );
        parms.push(parm);
        var parm = {};
        parm.name = 'SpecialDayNum';
        parm.value = ( $('#txtSpecialNumDays').val() == null ? '0' : $('#txtSpecialNumDays').val() );
        parms.push(parm);
        var parm = {};
        parm.name = 'MONFRI';
        parm.value = ( $('#txtMonFri').val() == null ? '0' : $('#txtMonFri').val() );
        parms.push(parm);
        var parm = {};
        parm.name = 'SAT';
        parm.value = ( $('#txtSaturday').val() == null ? '0' : $('#txtSaturday').val() );
        parms.push(parm)                                                                                                                                ;
        var parm = {};
        parm.name = 'SUN';
        parm.value = ( $('#txtSunday').val() == null ? '0' : $('#txtSunday').val() );
        parms.push(parm);

        $.post( gWebURL + '/CreateUpdateDeadline',{jData: parms} )
            .done( function(data) {
                getBaseDeadlines();
                showMsgPanel('Success', 'Deadline update complete') ;
            })

            .fail( function(xhr) {
                showMsgPanel('Warning',xhr.responseText);
            });
    }

    /*===================================================================================
     Function: LoadStatusList
     Purpose: Limit the Status dropdown list to the appropriate options available based on the value of the current status.
     Last Modified:
     ===================================================================================*/
    function LoadStatusList(CurrentStatus){


        $('#selStatus').empty();                  //<--Clear all previous options
        switch ( CurrentStatus ){

            case 'new' :
                $('#selStatus').append('<option value="revised" selected="true">Revised</option>') ;
                $('#selStatus').append('<option value="kill">Kill Order</option>') ;
                break;

            case 'promote2new' :
                $('#selStatus').append('<option selected disabled value="">Choose...</option>') ;
                $('#selStatus').append('<option value="revised">Revised</option>') ;
                $('#selStatus').append('<option value="kill">Kill Order</option>') ;
                break;

            case 'proposal' :
                $('#selStatus').append('<option value="proposal" selected="true">Proposal</option>') ;
                $('#selStatus').append('<option value="promote2new">Promote to New Order</option>') ;
                break;

            case 'revised' :
                $('#selStatus').append('<option value="revised" selected="true">Revised</option>') ;
                $('#selStatus').append('<option value="kill">Kill Order</option>') ;
                break;

            case 'default':
                $('#selStatus').append('<option value="proposal" selected="true">Proposal</option>') ;
                $('#selStatus').append('<option value="new">New</option>') ;
        }

    }

    /*===================================================================================
     Function: getSizeItems
     Purpose: Populate the Size/Dimension dropdown list based on selected value of the Product DD List.
     Last Modified:
     ===================================================================================*/
    function getSizeItems(ProductName){

        var listitems =  ""  ;
        var List = [
            {"Product": "PPT", "items": [
                {name: "Tabloid", val: 'T' },
                {name: "Standard", val: 'ST' },
                {name: "Flexie", val: 'FL' },
                {name: "Single Sheet", val: 'SS' }
            ]
            },
            {"Product": "Flag",    "items":  [
                {name: "3 x 3 Flag", val: 'F1' }       //Same as GOSS: 3X4 FLAG
            ]
            },
            {"Product": "PDL",    "items":  [
                {name: "4 Page Tab", val: 'T' },
                {name: "Single Sheet", val: 'SS' },   //8.5X11
                {name: "Smart Sheet", val: 'SS' },  // 10.5X11
                {name: "3 x 3 Flag", val: 'F1' }       //Same as GOSS: 3X4 FLAG
            ]
            },
            {"Product": "EN",    "items":    [
                {name: "Envelope", val: 'EN' }
            ]
            },
            {"Product": "BPB",    "items":     [
                {name: "Paper bag", val: 'PB' }
            ]
            },
            {"Product": "PBAG",      "items":  [
                {name: "Poly Big", val: 'P1' },
                {name: "Poly small", val: 'P2' },
                {name: "Poly None", val: 'P3' }
            ]
            }
        ];

        for(var i=0; i< List.length; i++){                      //<--Loop through the array and build the options for the Size DD
            if ( List[i].Product == ProductName){
                var Item= List[i].items ;

                for(var x=0; x< Item.length; x++){
                    listitems += '<option value=' + Item[x].val + '>' + Item[x].name + '</option>';x
                }
                break;
            }
        }
        $('#selSize').empty();                  //<--Clear any previous options
        $('#selSize').append('<option value="" disabled selected>Choose...</option>') ;  //<-- Populate first value
        $('#selSize').append(listitems);     //<--populate the dropdown list
        setNumPages();                         //<-- Set the default number of pages
    }
    /*===================================================================================
     Function: LoadColorItems
     Purpose: Populate the Color dropdown list based on selected value of the Size/Dimension DD List.
     Last Modified:
     ===================================================================================*/
    function LoadColorItems(){

        $('#selColor').empty();                     //<-- Clear any previous entries

        if ( $('#selProduct').val() != 'PDL' )  { return; }  //<-- This function is for Print & deliver product Only
        var SelectedSize = $('#selSize option:selected').text() ;
        var listitems = '' ;

        var List = [
            {"Size": "Single Sheet", "items": [
                {name: "1/0 Color", val: 'CDSS1C0C' },
                {name: "1/1 Color", val: 'CDSS1C1C' },
                {name: "2/1 Color", val: 'CDSS2C1C' },
                {name: "2/2 Color", val: 'CDSS2C2C' },
                {name: "4/1 Color", val: 'CDSS4C1C' },
                {name: "4/4 Color", val: 'CDSS4C4C' }
            ]
            },
            {"Size":  "3 x 3 Flag",    "items":          [
                {name: "1 Color", val: 'FPF1C3' },
                {name: "2 Color", val: 'FPF2C3' },
                {name: "4 Color", val: 'FPF4C3' },
                {name: "Adv. Supplied", val: 'FPFADV' }
            ]
            },
            {"Size": "Smart Sheet",    "items":  [
                {name: "4/4 Color", val: 'CDSM4C4C' }
            ]
            },
            {"Size": "4 Page Tab",    "items":    [
                {name: "1/1 Color", val: 'CD4T1C1C' },
                {name: "2/1 Color", val: 'CD4T2C1C' },
                {name: "2/2 Color", val: 'CD4T2C2C' },
                {name: "4/1 Color", val: 'CD4T4C1C' },
                {name: "4/4 Color", val: 'CD4T4C4C' }

            ]
            }
        ];

        for(var i=0; i< List.length; i++){                      //<--Loop through the array and build the options for the Size DD
            if ( List[i].Size == SelectedSize){
                var Item= List[i].items ;

                for(var x=0; x< Item.length; x++){
                    listitems += '<option value=' + Item[x].val + '>' + Item[x].name + '</option>';
                }
                break;
            }
        }
        $('#selColor').append('<option value="" disabled selected>Choose...</option>') ;  //<-- Populate first value
        $('#selColor').append(listitems);     //<--populate the dropdown list
    }

    /*===================================================================================
     Function: LoadPaperItems
     Purpose: Populate the Paper dropdown list based on selected value of the Size/Dimension DD List.
     Last Modified:
     ===================================================================================*/
    function LoadPaperItems(){

        $('#selPaper').empty();                     //<-- Clear any previous entries

        if ( $('#selProduct').val() != 'PDL' )  { return; }  //<-- This function is for Print & deliver Only
        var SelectedSize = $('#selSize option:selected').text() ;
        var listitems = '' ;
        var List = [
            {"Size": "Single Sheet", "items": [
                {name: "60# Offset", val: '60OFFSET' }
            ]
            },
            {"Size": "3 x 3 Flag",    "items":          [
                {name: "Standard", val: 'STANDARD' }
            ]
            },
            {"Size": "Smart Sheet",    "items":  [
                {name: "50# Coated", val: '50COATED' },
                {name: "60# Coated", val: '60COATED' }
            ]
            },
            {"Size": "4 Page Tab",    "items":    [
                {name: "60# Offset", val: '60OFFSET' }
            ]
            }
        ];

        for(var i=0; i< List.length; i++){                      //<--Loop through the array and build the options for the Size DD
            if ( List[i].Size == SelectedSize){
                var Item= List[i].items ;

                for(var x=0; x< Item.length; x++){
                    listitems += '<option value=' + Item[x].val + '>' + Item[x].name + '</option>';
                }
                break;
            }
        }
        $('#selPaper').append('<option value="" disabled selected>Choose...</option>') ;  //<-- Populate first value
        $('#selPaper').append(listitems);     //<--populate the dropdown list
    }

    /*===================================================================================
     Function: PopulateAdvDD
     Purpose: Populate the Advertiser dropdown lists.
     Last Modified:
     ===================================================================================*/
    function PopulateAdvDD(AdvData){

        var listitems = null;
        for(var i=0; i< AdvData.length; i++){                          //<--Loop through the json and build the options for the Adv DD
            listitems += '<option value=' + AdvData[i].AdvAccount + '>' + AdvData[i].AdvName + '</option>';
        }
        $('#selAdvName').append(listitems);     //<--populate the dropdown list
    } //EndFunct

    /*===================================================================================
     Function: PopulateAgyDD
     Purpose: Populate the Agency dropdown lists.
     Last Modified:
     ===================================================================================*/
    function PopulateAgyDD(AgyData){

        var listitems = null;
        for(var i=0; i< AgyData.length; i++){          //<--Loop through the json and build the options for the Agency DD
            listitems += '<option value=' + AgyData[i].AgyAccount + '>' + AgyData[i].AgyName + '</option>';
        }
        $('#selAgency').append(listitems);         //<--populate the dropdown list
    } //EndFunct

    /*===================================================================================
     Function: LoadZiplist
     Purpose: Populates the full zip list grid based on insert date.
     Last Modified:
     ===================================================================================*/
    function LoadZipData(){

        var InsertDate = $('#txtInsertDate').val().toString();

        if (InsertDate == gLastInsertDate) {
            return true;
        }else if (InsertDate == ""){
            showMsgPanel('Info', 'An insertion date must be selected before you can view a zip or zone selection.' );
            return false;
        }else{
            gLastInsertDate =   InsertDate;
        }
        var parms = [];
        var parm = {};
        parm.name = 'insertDate';
        parm.value = InsertDate;
        parms.push(parm);

        $.post(gWebURL + '/GetZipData',{jData:parms} )
            .done( function(data) {
                LoadSelectGrid(data[0]);
            })

            .fail( function(xhr) {
                showMsgPanel('Warning',xhr.responseText);
                return false;

            });
    }//EndFunct

    /*===================================================================================
     Function: GetOrder
     Purpose: Fetches all details related to a single order and populates the webpage.
     and order grid
     Last Modified: 02/12/17 : Jbudner
     ===================================================================================*/
    function GetOrder(OrderId){
        var parms = [];
        var parm = {};
        parm.name = 'OrderId';
        parm.value = OrderId;
        parms.push(parm);

        $.post(gWebURL + '/GetOrder',{jData:parms} )
            .done( function(data) {
                PopulateData(data[0][0]);
                LoadSelectGrid(null) ;
                gLastInsertDate = null;
                return true;
            })

            .fail( function(xhr) {
                showMsgPanel('Warning','Unable to retreive data:\n' + xhr.responseText);
                return false;
            });

    } //GetOrder

    /*===================================================================================
     Function: DrawsReCalc
     Purpose:  Calculate draw totals and charges.
     Last Modified:
     ===================================================================================*/
    function DrawsReCalc(){

        //Calc the values
        var HDdraw =  parseInt($('#txtHdDraw').val()) ;
        var SCdraw =  parseInt($('#txtScDraw').val());
        var TotalDraw = HDdraw + SCdraw ;
        var BilledDraw = 0;
        var OrderTotal = 0;

        var SpoilageDraw = parseInt( TotalDraw * gSpoilageRate ) ;

        if( gSpoilageRate == 0.10){             //<-- Print & Deliver Flags product selected
            BilledDraw =  Math.round( (TotalDraw + SpoilageDraw ) / 100 ) * 100 ;
            OrderTotal = ( BilledDraw );
        }else{                                         //<-- Any other product selected
            BilledDraw =  Math.round( (TotalDraw ) / 100 ) * 100 ;    //<-- Round to the nearest 100
            OrderTotal = ( BilledDraw + SpoilageDraw );
        }

        var Rate =  parseFloat($('#txtRate').val()) ;
        var BilledAmt = ( BilledDraw/1000 ).toFixed(1) ;   //Cost is calc at per thousand
        var Cost = (BilledAmt * Rate).toFixed(2); //Round to 2 places

        if ( Cost == NaN){ Cost = 0;}
        if ( Rate == ''){ Rate = 0 ;}

        //Set field values
        $('#txtSpoilage').val(SpoilageDraw );
        $('#txtOrderTotal').val(OrderTotal );
        $('#txtTotalCost').val(Cost );
        $('#txtBilledDraw').val(BilledDraw );

    }

    /*===================================================================================
     Function: SetSelection
     Purpose:  Checks or unchecks the checkbox in all rows in the "Select Zips" grid
     Last Modified:
     ===================================================================================*/
    function SetSelection(check){

        var rowscount = $("#jqxgridSelect").jqxGrid('getdatainformation').rowscount;

        $("#jqxgridSelect").jqxGrid('beginupdate');  //Pause Grid screen refresh

        for (var i = 0; i < rowscount; i++) {
            $("#jqxgridSelect").jqxGrid('setcellvalue', i, 'Selected', check, false); //Check or uncheck every box
        }
        $("#jqxgridSelect").jqxGrid('endupdate');   //restore Grid screen refresh

    }

    /*===================================================================================
     Function: ResetModalSearch
     Purpose: Clears all search criteria and resets the search fields to their initial state
     Last Modified:
     ===================================================================================*/
    function ResetModalSearch(){

        $('#txtSrchOrderId').val('') ;
        $('#txtSrchUser').val('') ;
        $('#txtSrchOrderName').val('') ;
        $('#selSrchStatus').val('0') ;
        $('#txtSrchFromDate').val('');
        $('#txtSrchToDate').val('');
        LoadResultsGrid(null);    //<-- Clears the grid

    }//Function

    /*===================================================================================
     Function: showSpinner
     Purpose:  Sets checkbox to all rows in grid
     Last Modified:
     ===================================================================================*/
    function showSpinner(){
        // var opts = {
        //     lines: 16, // The number of lines to draw
        //     length: 14, // The length of each line
        //     width: 14, // The line thickness
        //     radius: 40, // The radius of the inner circle
        //     rotate: 0, // The rotation offset
        //     color: '#5ba57b', // #rgb or #rrggbb
        //     speed: 1.3, // Rounds per second
        //     trail: 54, // Afterglow percentage
        //     shadow: true, // Whether to render a shadow
        //     hwaccel: false, // Whether to use hardware acceleration
        //     className: 'spinner', // The CSS class to assign to the spinner
        //     zIndex: 2e9, // The z-index (defaults to 2000000000)
        //     top: '300px', // Top position relative to parent in px
        //     left: 'auto' // Left position relative to parent in px
        // };
        // var target = document.getElementById('SpinWait');
        // var spinner = new Spinner(opts).spin(target);
        // $(target).data('spinner', spinner);
    }

    /*===================================================================================
     Function: PopulateData(json)
     Purpose: Populates field data with a previously saved order.
     Called by: GetOrder()
     Last Modified: 02/12/17: Jbudner
     ===================================================================================*/
    function PopulateData(json){

        $('#lblUserId').val(json.UserId) ;
        $('#txtOrderId').val(json.OrderId) ;
        $('#txtOrderName').val(json.OrderName) ;
        $('#selAdvName').val(json.AdvAccount).change();
        $('#txtVersionId').val(json.Version) ;
        $InsertDate.pikaday('setMoment',moment(json.InsertDate));
        $('#selAgency').val(json.AgyAccount).change() ;
        $('#selProduct').val(json.ProductCode).change();
        $('#selAdType').val(json.AdType).change();
        $('#selSize').val(json.SizeCode).change();
        $('#selPaper').val(json.PaperStock).change() ;
        $('#selColor').val(json.Color).change() ;
        ( json.Placement == 'Onsert' ?  $('#chkPlacement').prop("checked", true)  :  $('#chkPlacement').prop("checked", false)  )
        $('#selDollarVol').val(json.DollarVolume).change();
        $('#txtNumPages').val(json.NumOfPages) ;
        $('#selStatus').val(json.OrderStatus).change();
        $('#txtNumZips').val(json.TotalZip) ;
        $('#txtHdDraw').val(json.HdDraw) ;
        $('#txtScDraw').val(json.SCDraw) ;
        $('#txtBilledDraw').val(json.BilledDraw) ;
        $('#txtSpoilage').val(json.Spoilage) ;
        $('#txtOrderTotal').val(json.TotalDraw) ;
        $('#txtRate').val(json.Rate) ;
        $('#txtTotalCost').val(json.TotalCost) ;
        $('#txtADescription').val(json.Description) ;
        $('#txtASpecialInst').val(json.SpecInst)  ;

        LoadOrderGrid(json.ZipOrderd) ;
        GetOrderZips();     //<-- Make sure we captured all zip Id's in order grid for re-saving
        gDisableValidation = false; //<-- Restore validation if it was disabled for this pituclar save.
        $( "#DisableValidation" ).text( 'Disable Validation' ); //<-- Restore default text
        LoadStatusList( json.OrderStatus ) ;  //<-- Set the appropreate option for the current status

        if ( json.OrderStatus == 'kill' ) { $( "#btnSave" ).prop("disabled",true); } //Disable the "Save" button if order was previously killed
    }

    /*===================================================================================
     Function: showModal()
     Purpose: Displays the modal dialog and formats the display based on purpose
     Last Modified:
     ===================================================================================*/
    function showModal(purpose){


        $('#btnModSearch').hide();
        $('#btnModAddZips').hide();
        $('#btnModUnSelectAll').hide() ;
        $('#btnModSelectAll').hide() ;
        $('#btnModReset').hide() ;
        $('#btnModSync2Order').hide();
        $('#jqxgridSelect').hide();
        $('#divSearchCriteria').hide()
        $('#hrModFooter').hide();
        $('#divPrintDeliver').hide();

        switch(purpose) {
            case 'ZipList':
                $('#jqxgridSelect').show();
                $('#btnModAddZips').show();
                $('#btnModUnSelectAll').show() ;
                $('#btnModSelectAll').show() ;
                $('#btnModSync2Order').show();
                $('#spnModelTitle').text("Select Zip Codes");
                $('#hrModFooter').show();
                $('#modContent').css('width', '500') ;  //<-- Set width for zip grid    //DIFF
                break;

            case 'Search':
                $('#divSearchCriteria').show();
                $('#btnModReset').show() ;
                $('#btnModSearch').show();
                $('#spnModelTitle').text("Find Orders");
                $('#modContent').css('width', '700px') ;  //<-- Set width for search
                break;

            case 'PrintDeliver' :
                $('#divPrintDeliver').show();
                $('#spnModelTitle').text("Print and Deliver Options");
                $('#modContent').css('width', '400') ;
                break;
        }
        $('#modAllZipCodes').css('display', 'block');
    } //showModal

    /*===================================================================================
     Function: GetOrderZips
     Purpose:  Builds a list of the zip Id's from all rows in the Order grid
     Last Modified:
     ===================================================================================*/
    function GetOrderZips(){

        gZips2Save = '';  //<-- Clear any previous entry

        var rows = $('#jqxgridOrder').jqxGrid('getrows');  //<-- Returns a json of all rows in the grid

        if (rows.length == 0) {return;}  //<-- No records to save

        rows.forEach(function(obj) {
            gZips2Save = gZips2Save + obj.ID + ',' ;
        }); //forEach

        gZips2Save = gZips2Save.slice(0, -1);           //<-- remove the trailing comma

    }

    /*===================================================================================
     Function: ModAddZips
     Purpose:  Copies the selected zips and puts them in the order zip grid
     Last Modified:
     ===================================================================================*/
    function ModAddZips(){

        var arySelected = '[';
        var TotalDraw = 0;
        var TotalSCDraw = 0;

        gZips2Save = null;  //<-- Clear any previous entry

        var rows = $('#jqxgridSelect').jqxGrid('getrows');  //<-- Returns a json of all rows in the grid
        rows.forEach(function(obj) {
            if(obj.Selected == true){
                gZips2Save = gZips2Save + obj.ID + ',' ;
                arySelected = arySelected +  '{"ID":"'      + obj.ID
                    + '","Type":"'   + obj.Type
                    + '","Zip":"'      + obj.Zip
                    + '","City":"'     + obj.City
                    + '","Draw":'    + obj.Draw + '},' ;

                if (obj.Type == 'SC'){ TotalSCDraw = TotalSCDraw +  parseInt(obj.Draw) }
                TotalDraw = TotalDraw + parseInt(obj.Draw);
            }
        }); //forEach


        if( gZips2Save == null ) {      //<-- If no zips selected then clear the order screen
            LoadOrderGrid(null);
            $('#txtNumZips').val(0);
            $('#txtScDraw').val('0');
            $('#txtHdDraw').val('0' );
            DrawsReCalc();
            $('#modAllZipCodes').css('display', 'none');
            return;
        }

        arySelected = arySelected.slice(0, -1);               //<-- remove the trailing comma from last row
        gZips2Save = gZips2Save.slice(0, -1);              //<-- remove the trailing comma from last row
        arySelected = arySelected +']';                       //<-- Add trailing bracket

        var Gridrows = JSON.parse(arySelected);           //<-- Convert to object
        LoadOrderGrid(Gridrows);                                //<--Load selected zips into Order grid

        $('#txtNumZips').val(Gridrows.length);              //<-- Set value for TotZips

        $('#txtScDraw').val(TotalSCDraw);                   //<--Set SC draw

        $('#txtHdDraw').val( TotalDraw-TotalSCDraw ); //<--Set HD draw
        DrawsReCalc();
        $('#modAllZipCodes').css('display', 'none');
    }

    /*===================================================================================
     Function: ModSync2Order
     Purpose:
     Last Modified:
     ===================================================================================*/
    function ModSync2Order(){
        //This function syncs the selected zips between this and the Order grid
        var temp = $('#jqxgridOrder').jqxGrid('getrows');
        var OrderRowCount = temp.length ;
        if (OrderRowCount == 0) {return true;}  //No zips selected in order
        var OrderRows = temp.sort(function(a, b) { return parseFloat(a.Zip) - parseFloat(b.Zip); });
        var ZipRowCnt = $("#jqxgridSelect").jqxGrid('getdatainformation').rowscount;

        $("#jqxgridSelect").jqxGrid('beginupdate');
        var GridZip = null;
        var OrderZip = null;

        for (var i in OrderRows) {
            OrderZip = OrderRows[i].Zip;

            for (var i = 0; i < ZipRowCnt; i++) {
                GridZip = $('#jqxgridSelect').jqxGrid('getcellvalue', i, "Zip");

                if (GridZip == OrderZip) {
                    $("#jqxgridSelect").jqxGrid('setcellvalue', i, 'Selected', true, false);
                    break;
                }
            } //for loop
        } //for loop

        $("#jqxgridSelect").jqxGrid('endupdate');

    }; //function

    /*===================================================================================
     Function: ModSearch
     Purpose:
     Last Modified:
     ===================================================================================*/
    function ModSearch() {
        var parms = [];
        var parm = {};
        parm.name = 'OrderId';
        parm.value = $('#txtSrchOrderId').val();
        parms.push(parm);
        var parm = {};
        parm.name = 'OrderName';
        parm.value = $('#txtSrchOrderName').val();
        parms.push(parm);
        var parm = {};
        parm.name = 'UserId';
        parm.value = $('#txtSrchUser').val();
        parms.push(parm);
        var parm = {};
        parm.name = 'FromDate';
        parm.value = $('#txtSrchFromDate').val();
        parms.push(parm);
        var parm = {};
        parm.name = 'ToDate';
        parm.value = $('#txtSrchToDate').val();
        parms.push(parm);
        var parm = {};
        parm.name = 'OrderStatus';
        parm.value = $('#selSrchStatus').val();
        parms.push(parm);


        // var searchCriteria= '{"OrderId":"'           + $('#txtSrchOrderId').val()
        //                          + '","OrderName":"'      + $('#txtSrchOrderName').val()
        //                          + '","UserId":"'         + $('#txtSrchUser').val()
        //                          + '","FromDate":"'       + $('#txtSrchFromDate').val()
        //                          + '","ToDate":"'         + $('#txtSrchToDate').val()
        //                          + '","OrderStatus":"'      + ( $('#selSrchStatus').val() == null ? '' : $('#selSrchStatus').val() )
        //                          + '"}' ;

        $.post(gWebURL + '/SearchPrePrintRecords',{jData:parms})
            .done( function(data) {
                // if (rtnData == '{"SearchResult":['){      //<-- No valid data returned
                //     showMsgPanel('Info','Your search criteria did not find any matching orders...');
                //     return;
                // }
                LoadResultsGrid(data[0]) ;
            })

            .fail( function(xhr) {
                showMsgPanel('Warning',xhr.responseText);
            });

    }//Endfunc

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
                $('#MsgPanelContainer').addClass('w3-pale-green');
                break;
        }

        $('#spnMsgPanelBody').html(Message);
        $('#MsgPanel').css('display', 'block');
    }

    /*===================================================================================
     Function: Validator
     Purpose:  Validate that all required files as complete before saving record.
     Last Modified:
     ===================================================================================*/
    function Validator(){

        var Msg=[] ;


        if ( $('#selStatus').val() == null ) {
            showMsgPanel('Warning', 'The status field must not be empty')
            return false;
        };

        if ( gDisableValidation == true ) { return true; }       //<-- Admin has choosen to bypass validation rules for the currently viewed order

        if ( $('#selAdType').val() ==  null ) {Msg.push( 'Ad Type must be selected') } ;
        if ( $('#selAdvName').val() == null ) {Msg.push( 'Advertiser must selected') };
        if ( $('#txtInsertDate').val() == '' ) {Msg.push( 'Insert date must selected') };
        if ( $('#selProduct').val() == null ) {Msg.push( 'Product must selected') }
        if ( $('#txtRate').val() == '0' ) {Msg.push( 'Rate must not be blank or zero') };
        if ( $('#selSize').val() == null ) {Msg.push( 'Size/Dimension must selected') };
        if ( parseInt( $('#txtBilledDraw').val() ) < 1000 ) {Msg.push( 'Billed draw must be no less than 1,000') };

        // Items above are the minimum required for saving a Proposal
        if( $('#selStatus').val() == 'proposal' ) {
            if ( Msg.length > 0) {
                Msg = Msg.join('<br/>'); // join the array into a single string
                showMsgPanel('Warning',Msg) ;
                return false;
            }else{
                return true;
            }
        }
        //If not a Proposal then validate the remaining elements
        Msg.pop();  //Remove the last element of the array
        if ( $('#txtOrderName').val() == null  ) {Msg.push( 'Order Name must not be blank' )};
        if ( $('#selDollarVol').val() == null      ) {Msg.push( 'Dollar Volume must be selected' )};
        if ( $('#txtNumPages').val() == null   ) {Msg.push( 'Page count must not be blank or zero' )};
        if ( $('#txtVersionId').val() == null     ) {Msg.push( 'Version must not be blank')};
        if ( parseInt( $('#txtBilledDraw').val() ) < 10000 ) {Msg.push( 'Billed draw must be no less than 10,000' )};


        if (( $('#selStatus').val()  == 'new' ) || ( $('#selStatus').val()  == 'revised' ) ){
            if ( ( $('#selProduct').val() == 'EN' ) || ( $('#selProduct').val() == 'BPB' )  || ( $('#selProduct').val() == 'Flag' ) || ( $('#selProduct').val() == 'PPT' )  || ( $('#selProduct').val() == null) ) {
                if ( Msg.length > 0 ) {
                    Msg = Msg.join('<br/>'); // join the array into a single string
                    showMsgPanel('Warning',Msg) ;
                    return false;
                }else{
                    return true;
                }
            }

            if ( $('#selProduct').val() == 'PDL' ) {
                Msg.pop(); //Remove the last element of the array
                if ( $('#selPaper').val() == null ) {Msg.push( 'Paper Stock must be selected' )}
                if ( $('#selColor').val() == null ) {Msg.push( 'Color must be selected' )}
                if ( parseInt( $('#txtBilledDraw').val() ) < 20000 ) {Msg.push( 'Billed draw must be no less than 20,000')}
                if ( Msg.length > 0 ) {
                    Msg = Msg.join('<br/>'); // join the array into a single string
                    showMsgPanel('Warning',Msg) ;
                    return false;
                }else{
                    return true;
                }
            }
        }
    }

    /*===================================================================================
     Function: ModSync2Order
     Purpose:
     Last Modified:
     ===================================================================================*/
    function Save() {

        if  ( Validator() == false ) { return; } //<-- If validation fails don't bother to save.

        var saveMode = 'New';
        var saveTo = null;
        var tempStatus = null;

        if ( $('#txtOrderId').val() != '' ) { saveMode = 'Update'; }

        // Insure that an updated order has a status of Revised
        if ( $('#selStatus').val() == 'new' && $('#txtOrderId').val()  != '' ) {
            tempStatus = 'revised' ;
        } else {
            tempStatus = $('#selStatus').val() ;
        }

        //Save a proposal as a new order
        if ( $('#selStatus').val() == 'promote2new' ) { tempStatus = 'new' ; }


        //Only include this parm if this is updating an existing order
        // if ( $('#txtOrderId').val() != '' ) {
        //     saveMode = '';
        //     var parm = {};
        //     parm.name = 'OrderId';
        //     parm.value = $('#txtOrderId').val();
        //     parms.push(parm)
        // }
        // var parm = {};
        // parm.name = 'OrderStatus';
        // parm.value = tempStatus;
        // parms.push(parm);
        // var parm = {};
        // parm.name = 'InsertDate';
        // parm.value = $('#txtInsertDate').val();
        // parms.push(parm);
        // var parm = {};
        // parm.name = 'Deadline';
        // parm.value = $('#txtInsertDate').val();
        // parms.push(parm);
        // var parm = {};
        // parm.name = 'OrderName';
        // parm.value = $('#txtOrderName').val().replace(/"/g, '\'\'');
        // parms.push(parm);
        // var parm = {};
        // parm.name = 'AdvName';
        // parm.value = ( $('#selAdvName option:selected').text() == 'Choose...' ? '' : $('#selAdvName option:selected').text() );
        // parms.push(parm);
        // var parm = {};
        // parm.name = 'AdvAccount';
        // parm.value = $('#selAdvName').val();
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'AgyName';
        // parm.value = ( $('#selAgency option:selected').text() == 'Choose...' ? '' : $('#selAgency option:selected').text() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'AgyAccount';
        // parm.value = $('#selAgency').val();
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'Version';
        // parm.value = $('#txtVersionId').val().replace(/"/g, '\'\'');
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'TotalZip';
        // parm.value = $('#txtNumZips').val();
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'Product';
        // parm.value = ( $('#selProduct option:selected').text() == 'Choose...' ? '' : $('#selProduct option:selected').text() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'AdType';
        // parm.value = $('#selAdType').val();
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'AdSize';
        // parm.value = ( $('#selSize option:selected').text() == 'Choose...' ? '' : $('#selSize option:selected').text() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'NumOfPages';
        // parm.value = ( $('#txtNumPages').val()  == '' ? '0' : $('#txtNumPages').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'DollarVolume';
        // parm.value = $('#selDollarVol').val();
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'HdDraw';
        // parm.value = ( $('#txtHdDraw').val()  == '' ? '0' : $('#txtHdDraw').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'SCDraw';
        // parm.value = ( $('#txtScDraw').val()  == '' ? '0' : $('#txtScDraw').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'BilledDraw';
        // parm.value = ( $('#txtBilledDraw').val()  == '' ? '0' : $('#txtBilledDraw').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'Rate';
        // parm.value = ( $('#txtRate').val()  == '' ? '0' : $('#txtRate').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'Spoilage';
        // parm.value = ( $('#txtSpoilage').val()  == '' ? '0' : $('#txtSpoilage').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'TotalDraw';
        // parm.value = ( $('#txtOrderTotal').val()  == '' ? '0' : $('#txtOrderTotal').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'TotalCost';
        // parm.value = ( $('#txtTotalCost').val()  == '' ? '0' : $('#txtTotalCost').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'Description';
        // parm.value = $('#txtADescription').val().replace(/"/g, '\'\'');
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'SpecInst';
        // parm.value = $('#txtASpecialInst').val().replace(/"/g, '\'\'');
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'UserID';
        // parm.value = $('#aUserName').text().trim();
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'SizeCode';
        // parm.value = ( $('#selSize').val() == null ? '' : $('#selSize').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'ProductCode';
        // parm.value = $('#selProduct').val();
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'PaperStock';
        // parm.value = ( $('#selPaper').val() == null ? ''  : $('#selPaper').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'Color';
        // parm.value = ( $('#selColor').val() == null ? '' : $('#selColor').val() );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'Placement';
        // parm.value = ( $('#chkPlacement').prop("checked") == true ?  $('#chkPlacement').val() : '' );
        // parms.push(parm)
        // var parm = {};
        // parm.name = 'ZipOrderd';
        // parm.value = gZips2Save;
        // parms.push(parm)

        var parms = []; /*<-- Parameters object  */
        var parm = {};
        if (saveMode == 'Update'){ parm.OrderId = $('#txtOrderId').val(); }
        parm.OrderStatus = tempStatus;
        parm.InsertDate = $('#txtInsertDate').val();
        parm.Deadline = $('#txtInsertDate').val();
        parm.OrderName = $('#txtOrderName').val().replace(/"/g, '\'\'');
        parm.AdvName = ( $('#selAdvName option:selected').text() == 'Choose...' ? '' : $('#selAdvName option:selected').text() );
        parm.AdvAccount = ( $('#selAdvName').val() == null ? '' : $('#selAdvName').val() );
        parm.AgyName = ( $('#selAgency option:selected').text() == 'Choose...' ? '' : $('#selAgency option:selected').text() );
        parm.AgyAccount = ( $('#selAgency').val() == null ? '' : $('#selAgency').val() );
        parm.Version = $('#txtVersionId').val().replace(/"/g, '\'\'');
        parm.TotalZip = $('#txtNumZips').val();
        parm.Product = ( $('#selProduct option:selected').text() == 'Choose...' ? '' : $('#selProduct option:selected').text() );
        parm.AdType = $('#selAdType').val();
        parm.AdSize = ( $('#selSize option:selected').text() == 'Choose...' ? '' : $('#selSize option:selected').text() );
        parm.NumOfPages = ( $('#txtNumPages').val()  == '' ? '0' : $('#txtNumPages').val() );
        parm.DollarVolume = $('#selDollarVol').val();
        parm.HdDraw = ( $('#txtHdDraw').val()  == '' ? '0' : $('#txtHdDraw').val() );
        parm.SCDraw = ( $('#txtScDraw').val()  == '' ? '0' : $('#txtScDraw').val() );
        parm.BilledDraw =  ( $('#txtBilledDraw').val()  == '' ? '0' : $('#txtBilledDraw').val() );
        parm.Rate = ( $('#txtRate').val()  == '' ? '0' : $('#txtRate').val() );
        parm.Spoilage = ( $('#txtSpoilage').val()  == '' ? '0' : $('#txtSpoilage').val() );
        parm.TotalDraw = ( $('#txtOrderTotal').val()  == '' ? '0' : $('#txtOrderTotal').val() );
        parm.TotalCost = ( $('#txtTotalCost').val()  == '' ? '0' : $('#txtTotalCost').val() );
        parm.Description = $('#txtADescription').val().replace(/"/g, '\'\'');
        parm.SpecInst = $('#txtASpecialInst').val().replace(/"/g, '\'\'');
        parm.UserID = $('#aUserName').text().trim();
        parm.SizeCode = ( $('#selSize').val() == null ? '' : $('#selSize').val() );
        parm.ProductCode = $('#selProduct').val();
        parm.PaperStock = ( $('#selPaper').val() == null ? ''  : $('#selPaper').val() );
        parm.Color = ( $('#selColor').val() == null ? '' : $('#selColor').val() );
        parm.Placement = ( $('#chkPlacement').prop("checked") == true ?  $('#chkPlacement').val() : '' );
        parm.ZipOrdered = gZips2Save;
        parms.push(parm);

        if (saveMode == 'New') {
            saveTo = 'CreateOrder' ;       //<-- Insert New order
        }else{
            saveTo = 'UpdateOrder' ;    //<-- update existing order
        }

        var jsonStr = JSON.stringify(parms);

        var Order = [];
        var item = {};
        item.name = 'json';
        item.value = jsonStr;
        Order.push(item);

        $.post(gWebURL + '/' + saveTo, {jData:Order})
            .done( function(data) {
                var OrderId = data[0][0].OrderId;

                if (saveMode == 'New'){
                    $('#txtOrderId').val( OrderId ) ;
                    showMsgPanel('Success', 'New Order Created...') ;
                }else{
                    showMsgPanel('Success', 'Order ' +  OrderId + ' updated...') ;
                }

                LoadStatusList( $('#selStatus').val() ) ;              //<-- Load the staus selections based on current status
                if ( $('#selStatus').val() == 'kill' ) { return 'Disabled' ; } //<-- Do not re-enble Save button if active order is killed
            })

            .fail( function(xhr) {
                showMsgPanel('Warning', 'Error saving order, contact your system administrator:\n.' + xhr.responseText);
            });

    }

    /*===================================================================================
     Function: Reset
     Purpose: Clears all data entry and resets the screen back to it's initial state
     Last Modified:
     ===================================================================================*/
    function Reset() {
        $('.Draws').val('0');
        $('.InputVals').val('');
        $('select').val('');
        $('#selStatus').val('new');
        $('#selSize').empty();
        $('#selPaper').empty();
        $('#selColor').empty();
        $('#chkPlacement').prop("checked", false) ;
        $('textarea').val('');
        LoadOrderGrid(null) ; //<-- Clears the Order grid
        $('#txtInsertDate ').val('');
        gZips2Save = '[]';   //<-- Global var for ordered zips
        $( "#btnSave" ).prop("disabled",false);  //Restore normal use of the "Save" button
        $('#btnPrintDeliver').hide();
        $("#lblDeadline").text('');
        $("#lblDeadline").removeClass("w3-green w3-yellow w3-red");
        gDisableValidation = false; //<-- Insure validation is on when page is reset
        $( "#DisableValidation" ).text( 'Disable Validation' ); //<-- Restore default text
        LoadStatusList('default'); //<-- Set the default status options
    }

    /*===================================================================================
     Function: InsertDate Change event
     Purpose: Whenever the Insert date is changed a new deadline is calculated.
     Last Modified:
     ===================================================================================*/
    function  SetDeadlineNotice(InsertDate) {

        // var NumDays = 0;
        //
        // switch( moment(InsertDate).day() ){
        //
        //     case  0:
        //         NumDays = gDeadlineSUN;
        //         break;
        //
        //     case  6:
        //         NumDays = gDeadlineSAT;
        //         break;
        //
        //     default:
        //         NumDays = gDeadlineMF;
        //         break;
        // }

        //var Deadline = null;

        var parms = [];
        var parm = {};
        parm.name = 'InsertDate';
        parm.value = InsertDate;
        parms.push(parm);

        $.post(gWebURL + '/getDeadlineDate', {jData:parms})
            .done( function(data) {
                var Deadline = moment( data[0][0].DeadlineDate ) ;
                $('#lblDeadline').text( Deadline.format('MM/DD/YY') );

                //Clear any previous formatting
                $('#btnSave').prop("disabled",false);
                $("#lblDeadline").removeClass("w3-green");
                $("#lblDeadline").removeClass("w3-yellow");
                $("#lblDeadline").removeClass("w3-red");

                var Today = moment();

                if ( Deadline.isBefore(Today,'days') ){
                    $("#lblDeadline").addClass("w3-red");   //Deadline has passed
                    $('#btnSave').prop("disabled",true);
                    return;
                }

                if ( Deadline.isAfter(Today,'days') ){
                    $("#lblDeadline").addClass("w3-green");  //Deadline is in the future
                    return;
                }

                if ( Deadline.isSame(Today,'days') ){
                    $("#lblDeadline").addClass("w3-yellow");  //Deadline is today
                }

            })

            .fail( function(xhr) {
                showMsgPanel('Warning', 'Error saving order, contact your system administrator:\n.' + xhr.responseText);
            });



    }

    /*===================================================================================
     Function: Size/Dimmension Change event
     Purpose: Sets the default number of pages value based on selection.
     Last Modified:
     ===================================================================================*/
    function setNumPages(){

        switch($('#selSize').val() ){

            case 'SS':
                if ( $('#selSize option:selected').text() == '4 Page Tab' ) {
                    $('#txtNumPages').val('4');
                }else{
                    $('#txtNumPages').val('1');
                }
                $('#txtNumPages').prop("disabled",true);
                break;
            case 'EN':
            case 'PB':
            case 'P1':
            case 'P2':
            case 'P3':
                $('#txtNumPages').val('1');
                $('#txtNumPages').prop("disabled",true);
                break;

            case 'F1':
                $('#txtNumPages').val('Flag');
                $('#txtNumPages').prop("disabled",true);
                break;

            default:
                $('#txtNumPages').val('');
                $('#txtNumPages').prop("disabled",false);
                break;
        }

    }
    /**********************************************************************************************************************
     ALL  EVENTS  BELOW
     **********************************************************************************************************************/
    /*===================================================================================
     Function: Rate Input-Event to update the draw charges
     Purpose: Whenever the rates are manually updated the charges are recalculated based
     on inputed values.
     Last Modified:
     ===================================================================================*/
    $('#txtRate').on('input', function() {  DrawsReCalc();  });

    /*===================================================================================
     Function: Product DD Change event to update spoilage
     Purpose: Whenever the Product is changed a new spoilage value is calculated.
     Last Modified:
     ===================================================================================*/
    $('#selProduct').change( function () {

        if ( $('#selProduct option:selected').text() == 'Print & Deliver Flags' ){
            gSpoilageRate = 0.10 ;
            $('#lblSpoilage').text('10% Spoilage:') ;
        }else{
            gSpoilageRate = 0.02 ;
            $('#lblSpoilage').text('2% Spoilage:') ;
        }
        DrawsReCalc() ;

        getSizeItems( $(this).val() );  //<--Loads the Size/Dimmension DD list
    });

    /*===================================================================================
     Function: Size/Dimmension Change event
     Purpose: Calls the function to set the default "number of pages" value based on selection.
     Last Modified:
     ===================================================================================*/
    $('#selSize').change( function () {
        setNumPages();                         //<-- Set the default number of pages
        LoadColorItems();
        LoadPaperItems();
    });

    /*===================================================================================
     Function: jqxgridResults Click event
     Purpose:  User selects a grid row by clicking, this identifies the specific order to retreive and populate the webpage
     Last Modified:
     ===================================================================================*/
    $('#jqxgridResults').on('cellclick', function (event) {

        var row = event.args.rowindex;       //<-- get the row number selected
        var datarow = $("#jqxgridResults").jqxGrid('getrowdata', row);  //<-- Get a json of all datafields in selected row
        GetOrder( datarow.OrderId ) ;         //<-- Extract the OrderId and call function to get order data
        ResetModalSearch() ;                    //<-- Clear all the search fields
        $('#btnModCancel').trigger('click');  //<-- Trigger the Cancel click event to close the modal.
    });

    /*===================================================================================
     Function: UserId Click event
     Purpose:  Shows "Logout" option
     Last Modified:
     ===================================================================================*/
    $( "#lblUserId" ).click(function() {
        $('#spnLogOff').css('display', 'inline-block');
    });

    /*===================================================================================
     Function:OpenAdminPanel Click-event
     Purpose:Opens the Admin panel
     Last Modified:
     ===================================================================================*/
    $( "#showAdminPanel" ).click(function() {
        $('#AdminPanel').css('display', 'block');
    });

    /*===================================================================================
     Function:DisableValidation Click-event
     Purpose:Opens the Admin panel
     Last Modified:
     ===================================================================================*/
    $( "#DisableValidation" ).click(function() {
        if ( gDisableValidation == false ){
            gDisableValidation = true;
            $( "#DisableValidation" ).text( 'Disable Validation ✓' );
        }else{
            gDisableValidation = false;
            $( "#DisableValidation" ).text( 'Disable Validation' );
        }
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
     Function:btnAdminCancel Click-event
     Purpose: Calls Reset function
     Last Modified:
     ===================================================================================*/
    $( "#btnAdminSave" ).click(function() {
        UpdateDeadlines();
    });

    /*===================================================================================
     Function: btnZipSelect Click-event
     Purpose: Opens the modal dialog and displays the full zip list grid for zip selection
     Last Modified:
     ===================================================================================*/
    $( "#btnZipSelect" ).click(function() {
        if ( LoadZipData() == false) {return;} //<-- If grid load fails, don't show modal.
        showModal('ZipList');
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
     Function: btnOpenSearch
     Purpose:  Display the search criteria in the modal dialog
     Last Modified:
     ===================================================================================*/
    $( '#btnOpenSearch' ).click(function() {
        showModal('Search');
    });

    /*===================================================================================
     Function: btnClone click-Event
     Purpose:
     Last Modified:
     ===================================================================================*/
    $( '#btnClone' ).click(function() {

        $('#txtOrderId') .val('') ;
        $('#txtInsertDate ').val('');
        $('#txtNumPages') .val('') ;
        $('#selSize').val(0);
        $('#selStatus').val('new');
        $('#txtRate') .val('') ;
        $( "#btnSave" ).prop("disabled",false);  //Restore normal use of the "Save" button
        gDisableValidation = false;                   //<-- Insure validation is on when order is cloned
        LoadStatusList('default'); //<-- Set the default status options
    });

    /*===================================================================================
     Function: btnModAddZips event
     Purpose: Copy selected zip codes to the order grid
     Last Modified:
     ===================================================================================*/
    $( '#btnModAddZips' ).click(function() {
        ModAddZips();
    });

    /*===================================================================================
     Function: btnModSearch Click-event
     Purpose: Builds the json for the search query based on user criteria
     Last Modified:
     ===================================================================================*/
    $( '#btnModSearch' ).click(function() {
        ModSearch()
    });

    /*===================================================================================
     Function: btnModCancel and XmodClose Click-events
     Purpose:  Hides the modal
     Last Modified:
     ===================================================================================*/
    $('#btnModCancel, #XmodClose').click(function() {
        $('#modAllZipCodes').css('display', 'none');
    });

    /*===================================================================================
     Function: ButtonModReset Click-event
     Purpose:  Calls the function to clear all search criteria
     Last Modified:
     ===================================================================================*/
    $('#btnModReset').click(function() {
        ResetModalSearch() ;
    });

    /*===================================================================================
     Function: btnModSelectAll
     Purpose:
     Last Modified:
     ===================================================================================*/
    $("#btnModSelectAll").click(function() {
        SetSelection(true) ;
    });

    /*===================================================================================
     Function: btnModUnSelectAll
     Purpose:
     Last Modified:
     ===================================================================================*/
    $("#btnModUnSelectAll").click(function() {
        SetSelection(false);
    });

    /*===================================================================================
     Function: btnModSync2Order
     Purpose:
     Last Modified:
     ===================================================================================*/
    $('#btnModSync2Order').click(function() {
        ModSync2Order();
    });
    /*===================================================================================
     Function: MsgPanelBtn-Click
     Purpose:
     Last Modified:
     ===================================================================================*/
    $('#MsgPanelBtn').click(function() {
        $('#MsgPanel').css('display', 'none');
    });

    /*===================================================================================
     Function: AdminPanelBtn-Click
     Purpose:
     Last Modified:
     ===================================================================================*/
    $('#AdminPanelBtn, #btnAdminCancel').click(function() {
        $('#AdminPanel').css('display', 'none');
    });


}) //<-- /Doc Ready

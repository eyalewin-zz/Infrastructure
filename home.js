var Type;
var Url;
var Data;
var ContentType;
var DataType;
var ProcessData;
var rows;

function WCFJSON() {
    var userid = "1";
    Type = "POST";
    Url = "Service/Service.svc/GetUser";
    Data = '{"Id": "' + userid + '"}';
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    varProcessData = true;
    CallService();
}

function WCFJSON_GET() {
    var value = 5;
    Type = "GET";
    Url = "Service/Service.svc/GetData";
    Data = '{"value": "' + value + '"}';
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    CallService();
}

function getPersons() {
    Type = "GET";
    Url = "Service/Service.svc/GetPersonsSPByValue";
    Data = { value: 'K' };
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    varProcessData = true;
    CallService();
}

function addPerson() {
    debugger;
    var personObj = {
        FirstName: 'Dodo',
        MiddleName: 'Shay',
        LastName: 'Levi',
    }


    Type = "POST";
    Url = "Service/Service.svc/AddPerson";
    Data = JSON.stringify({ person: personObj });
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    CallService(isStop = true);
}

// Function to call WCF  Service       
function CallService(isStop) {
    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: Data, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        //processdata: ProcessData, //True or False
        success: function (msg) {//On Successfull service call
            if (isStop) {
                console.log(msg);
            } else {
                ServiceSucceeded(msg);
            }
        },
        error: ServiceFailed// When Service call fails
    });
}

function ServiceFailed(result) {
    alert('Service call failed: ' + result.status + '' + result.statusText);
    Type = null;
    varUrl = null;
    Data = null;
    ContentType = null;
    DataType = null;
    ProcessData = null;
}

function ServiceSucceeded(result) {
    if (DataType == "json") {
        //if (result.GetUserResult != undefined) {
        //    resultObject = result.GetUserResult;
        //    for (i = 0; i < resultObject.length; i++) {
        //        console.log(resultObject[i]);
        //    }

        //    WCFJSON_GET();
        //} else {
        //    if (result.length > 0) {
        //        for (i = 0; i < result.length; i++) {
        //            console.log(result[i]);
        //        }
        //    } else {
        //        console.log(result);
        //    }
        //}

        buildTable(result);
    }
}

function ServiceFailed(xhr) {
    alert(xhr.responseText);

    if (xhr.responseText) {
        var err = xhr.responseText;
        if (err)
            error(err);
        else
            error({ Message: "Unknown server error." })
    }

    return;
}

function buildTable(result) {
    for (var i = 0; i < result.length; i++) {
        var st = '<div class="tableRow col-md-12">';

        st += '<div class="tableData col-md-3">';
        st += '<span>' + (i + 1) + '</span>';
        st += '</div>';

        st += '<div class="tableData col-md-3">';
        st += '<span>' + result[i].FirstName + '</span>';
        st += '</div>';

        st += '<div class="tableData col-md-3">';
        st += '<span>' + result[i].MiddleName + '</span>';
        st += '</div>';

        st += '<div class="tableData col-md-3">';
        st += '<span>' + result[i].LastName + '</span>';
        st += '</div>';

        st += '</div>';

        $('.tableContent').append(st);
    }

    $('.tableFotter input').keyup(function (e) {
        /* Ignore tab key */
        var code = e.keyCode || e.which;
        if (code == '9') return;

        var $input = $(this);
        var inputContent = $input.val().toLowerCase();
        var $table = $input.parents('.tableContainer');
        var column = $input.data('index');
        var $rows = $table.find('.tableContent .tableRow');

        //var $rows = $table.find('.tableContent .tableRow:visible');
        //if (code == '8') {
        //    $rows = $table.find('.tableContent .tableRow');
        //}

        debugger;
        var inputLength = $input.parents('.tableFotter').find('input').length;
        var inputDataCount = 0;
        var arrayInput = [];
        for (var i = 0; i < inputLength; i++) {
            var item = $input.parents('.tableFotter').find('input')[i];
            if ($(item).val() != "") {
                inputDataCount++;
                arrayInput.push($(item).data('index'));
            }
        }

        var $filteredRows = $rows.filter(function () {
            var value = $(this).find('span').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });

        if (inputDataCount > 1) {
            $rows.show();
            $filteredRows.hide();

            for (var i = 0; i < arrayInput.length; i++) {
                inputContent = $($input.parents('.tableFotter').find('input')[arrayInput[i]]).val().toLowerCase();
                var $secondfilteredRows = $table.find('.tableContent .tableRow:visible').filter(function () {
                    var value = $(this).find('span').eq(arrayInput[i]).text().toLowerCase();
                    return value.indexOf(inputContent) === -1;
                });

                $filteredRows = $secondfilteredRows;
            }

            $secondfilteredRows.hide();
        } else {
            $rows.show();
            $filteredRows.hide();
        }


        if ($filteredRows.length === $rows.length) {
            //$table.find('tableContent').prepend($('<div class="no-result text-center"><td colspan="' + $table.find('.filters th').length + '">No result found</td></tr>'));
        }
    });
}

$(function () {
    //WCFJSON();
    getPersons();
});
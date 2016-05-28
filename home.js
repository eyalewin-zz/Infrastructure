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

    $('.tableHeader').click(function () {
        var header = $(this);
        var column = header.data('index');
        var $table = header.parents('.tableContainer');
        var $rows = $table.find('.tableContent .tableRow:visible');
        var type;
        if (header.data('type') != undefined) {
            if (header.data('type') === 'desc') {
                header.data('type', 'asc');
            } else {
                header.data('type', 'desc');
            }
        } else {
            header.data('type', 'asc');
        }

        type = header.data('type');

        $('.tableRow').sortElements(function (a, b) {
            if (type === 'desc') {
                if (column === 0) {
                    return parseInt($(a).find('span').eq(column).text()) < parseInt($(b).find('span').eq(column).text()) ? 1 : -1;
                } else {
                    return $(a).find('span').eq(column).text().toLowerCase() < $(b).find('span').eq(column).text().toLowerCase() ? 1 : -1;
                }
            } else {
                if (column === 0) {
                    return parseInt($(a).find('span').eq(column).text()) > parseInt($(b).find('span').eq(column).text()) ? 1 : -1;
                } else {
                    return $(a).find('span').eq(column).text().toLowerCase() > $(b).find('span').eq(column).text().toLowerCase() ? 1 : -1;
                }
            }
        });
    });

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
        if (code == '8') {
            $rows = $table.find('.tableContent .tableRow');
        } else if (rows != undefined) {
            $rows = rows;
        }

        debugger;
        //var inputLength = $input.parents('.tableFotter').find('input').length;
        //var inputDataCount = 0;
        //var arrayInput = [];
        //for (var i = 0; i < inputLength; i++) {
        //    var item = $input.parents('.tableFotter').find('input')[i];
        //    if ($(item).val() != "") {
        //        inputDataCount++;
        //        arrayInput.push($(item).data('index'));
        //    }
        //}

        var $filteredRows = $rows.filter(function () {
            var value = $(this).find('span').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });

        //if (inputDataCount > 1) {
        //    $rows.show();
        //    $filteredRows.hide();

        //    for (var i = 0; i < arrayInput.length; i++) {
        //        inputContent = $($input.parents('.tableFotter').find('input')[arrayInput[i]]).val().toLowerCase();
        //        var $secondfilteredRows = $table.find('.tableContent .tableRow:visible').filter(function () {
        //            var value = $(this).find('span').eq(arrayInput[i]).text().toLowerCase();
        //            return value.indexOf(inputContent) === -1;
        //        });

        //        $filteredRows = $secondfilteredRows;
        //    }

        //    $secondfilteredRows.hide();
        //} else {
        //    $rows.show();
        //    $filteredRows.hide();
        //}

        $rows.show();
        $filteredRows.hide();

        rows = $table.find('.tableContent .tableRow:visible');

        if ($filteredRows.length === $rows.length) {
            $table.find('.tableContent').prepend($('<div class="no-result text-center">No result found</div>'));
        }
    });
}

$(function () {
    //WCFJSON();
    getPersons();
});

jQuery.fn.sortElements = (function () {

    var sort = [].sort;

    return function (comparator, getSortable) {

        getSortable = getSortable || function () { return this; };

        var placements = this.map(function () {

            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,

                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );

            return function () {

                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }

                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);

            };

        });

        return sort.call(this, comparator).each(function (i) {
            placements[i].call(getSortable.call(this));
        });

    };

})();
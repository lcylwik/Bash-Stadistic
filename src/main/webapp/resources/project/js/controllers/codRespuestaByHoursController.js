materialAdmin
    .controller('codRespByHoursController', function ($sce, $document, ngTableParams, tableService, $scope, SERVICIOS, $filter, $timeout) {
        var tctrl = this;
        var codigosColumn = 'codigoRespuesta';

        $scope.filters = {
            firstDate: moment().format('YYYY-MM-DD')
        };
        $scope.onTimeSet = function (newDate, oldDate, field) {
            $scope[field] = !$scope[field];
        }

        $scope.datos = SERVICIOS.getService().then(function (trans) {
            $scope.datos = trans.data;
            tctrl.initCatalogo();
            $scope.tableParams = tctrl.generateTableParams();

            tctrl.generateData();
            tctrl.generateChart();

        });

        tctrl.initCatalogo = function (){
            var obj = $scope.datos[0];
            $scope.catalogo = {};
            Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
                $scope.catalogo[val] = tctrl.getElementsFromArray($scope.datos, val);
            });
        }

        tctrl.getElementsFromArray = function (array, columnaAcomparar) {
            var codigos = [];
            angular.forEach(array, function (element) {
                if (codigos.indexOf(element[columnaAcomparar].toString()) == -1) {
                    codigos.push(element[columnaAcomparar].toString());
                }
            })
            return codigos;
        }

        tctrl.getColumnas = function (codigo) {

            var firstDate = $scope.filters.firstDate,
                columnas = []; totalXCodigo = 0;

            var data = $scope.datos.filter(tctrl.filterFunction);

            while (moment(firstDate).isBefore(moment($scope.filters.firstDate).add(1, 'days'))) {
                var hour = moment(firstDate).format("h a");

                var cant = tctrl.getCantTransacciones(codigosColumn, codigo, firstDate, 'prtProcDte', data);
                $scope.arrayTotal[hour] = $scope.arrayTotal[hour] != undefined ? $scope.arrayTotal[hour] + cant : cant;
                totalXCodigo += cant;

                var obj = {
                    title: hour,
                    field: hour,
                    cantidad:cant //TODO: aki se cambian los literales de las columnas
                }
                columnas.push(obj);
                firstDate = moment(firstDate).add(1, 'hour');
            }
            columnas.push({
                title: 'Total',
                field: 'Total',
                cantidad: totalXCodigo,
            });

            $scope.columnas = columnas;
            return columnas;
        }

        tctrl.getCantTransacciones = function (columna, valor, date, nombreColumnaFecha, data) {
            var cant = 0;
            angular.forEach(data, function (value) {
                if (value[columna] == valor && $filter('date')(value[nombreColumnaFecha], 'yyyy-MM-dd h a').toLowerCase() == moment(date).format('YYYY-MM-DD h a')) {
                    cant++;
                }
            });
            return cant;
        }

        tctrl.filterFunction = function(el){
            var rtn  = true;
            if(!$scope.filters.all){
                return rtn;
            }
            Object.getOwnPropertyNames($scope.filters.all).forEach(function(val, idx, array) {
                if($scope.filters.all[val] && $scope.filters.all[val] != "" && $scope.filters.all[val] instanceof Array){
                    var temp = false;
                    angular.forEach($scope.filters.all[val], function(value){
                       if(el[val] == value) {
                           temp = true;
                       }
                    });
                    rtn = rtn && temp;
                }else if($scope.filters.all[val] && $scope.filters.all[val] != "" && typeof $scope.filters.all[val] === "string"){
                    if(el[val].indexOf($scope.filters.all[val]) === -1){
                        rtn = false;
                    }
                }
            });

            return rtn;
        }

        $scope.$watch('filters', function () {
            $scope.tableParams = tctrl.generateTableParams();

            tctrl.generateData();
            tctrl.generateChart();

        }, true);


        // tabla con filtro por codigo de respuesta
        tctrl.generateTableParams = function(){
            return new ngTableParams({
                page: 1,
                count: 10

            }, {
                total: $scope.catalogo[codigosColumn].length,
                //Funcion para el paginador
                getData: function ($defer, params) {
                    var data = [];
                    $scope.arrayTotal = {};

                    angular.forEach($scope.catalogo[codigosColumn], function(codigo){
                        var obj = {
                            title: codigo,
                            dias: tctrl.getColumnas(codigo)
                        }
                        data.push(obj);
                    })

                    data = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
                    params.total(data.length); // set total for recalc pagination
                    data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve(data);
                }
            });
        };



        //métodos para la gráfica

        tctrl.generateData = function () {
            var data = [];
            $scope.arrayTotal = {};

            angular.forEach($scope.catalogo[codigosColumn], function (codigo) {
                var obj = {
                    title: codigo,
                    dias: tctrl.getColumnas(codigo)
                }
                data.push(obj);
            })
            $scope.tableData = data;
        }


        tctrl.findCantByDay = function (array, hour) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].title == hour && array[i].title!="Total") {
                    return array[i].cantidad;
                }
            }
            return 0;
        }
        tctrl.getDaysByCode = function (array, code) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].title == code ) {
                    return array[i].dias;
                }
            }
            return 0;
        }


        // Grafica Line Chart

        tctrl.generateChart = function () {

            $scope.myChartObject = {};

            $scope.myChartObject.type = "LineChart";
            $scope.myChartObject.data = {cols: [], rows: []};

            $scope.myChartObject.data.cols.push({
                "id": "date",
                "label": "Fecha",
                "type": "string",
                "p": {}
            });
            angular.forEach($scope.catalogo[codigosColumn], function (value) {
                $scope.myChartObject.data.cols.push({
                    "id": value,
                    "label": value,
                    "type": "number",
                    "p": {}
                });
            });
            angular.forEach($scope.columnas, function (object) {
                if(object.title!="Total"){
                    var objRows = [{v: object.title}];
                    angular.forEach($scope.catalogo[codigosColumn], function (value) {
                        var dias = tctrl.getDaysByCode($scope.tableData, value);
                        objRows.push({
                            v: tctrl.findCantByDay(dias, object.title)
                        })
                    });
                    $scope.myChartObject.data.rows.push({
                        c: objRows
                    });
                }


            });
            $scope.myChartObject.options = {
                "title": "Transacciones por Código de Respuesta",
                "isStacked": "true",
                "fill": 20,
                'is3D': 'true',
                "displayExactValues": true,
                "vAxis": {
                    "title": "Cant. Transacciones",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Fecha"
                }
            }


        }


    })
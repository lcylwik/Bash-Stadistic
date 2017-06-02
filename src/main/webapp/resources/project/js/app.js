var materialAdmin = angular.module('materialAdmin', [
    'ngAnimate',
    'ngResource',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'oc.lazyLoad',
    'nouislider',
    'ngTable',
    'googlechart',
    'btorfs.multiselect',
    'ui.bootstrap.datetimepicker',
    '720kb.datepicker'
])

Array.prototype.stanDeviate = function(){
    var i,j,total = 0, mean = 0, diffSqredArr = [];
    for(i=0;i<this.length;i+=1){
        total+=this[i];
    }
    mean = total/this.length;
    for(j=0;j<this.length;j+=1){
        diffSqredArr.push(Math.pow((this[j]-mean),2));
    }
    return (Math.sqrt(diffSqredArr.reduce(function(firstEl, nextEl){
        return firstEl + nextEl;
    })/this.length));
};

Array.prototype.mediam = function(){
    var i, total = 0;
    for(i=0;i<this.length;i+=1){
        total+=this[i];
    }
    return total/this.length;
}

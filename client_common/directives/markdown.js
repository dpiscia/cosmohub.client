var app = angular.module('markdown_app', ['ngSanitize']);

app.directive('markdown', function ($sanitize) {
    var converter = new Showdown.converter();
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
        	if (attrs.markdown) {
          		scope.$watch(attrs.markdown, function (newVal) {
            	var html = newVal ? $sanitize(converter.makeHtml(newVal)) : '';
            	element.html(html);
         		 });
         	} else {
            var htmlText = $sanitize(converter.makeHtml(element.text()));
            element.html(htmlText);
            }
        }
    };

});
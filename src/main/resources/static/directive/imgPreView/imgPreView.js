
/**
 * 使用方法：将imgpreview.css和此文件引入，然后在html页面相关位置加上指令
 * <img ng-src="{{item.cloudSrc}}" title="点击放大预览" width=200 height=200 class="{{item.id}}" enlarge-pic/>
 * 
 *	<div class="mask" close-Pic>
 * 		<div class="mask-box"></div>
 * 		<div class="big-pic-wrap">
 *	      	<img src="" alt="" class="bigPic" />
 *	      	<span class="close-pic"><i class="fa fa-close"></i></span> 
 *	    </div>
 *	</div>
**/
(function (){
	'use strict';
	angular.module('previewPicModule',[])
	.directive('enlargePic',function(){//enlargePic指令名称，写在需要用到的地方img中即可实现放大图片
	    return{  
	        restrict: "AE",  
	        link: function(scope,elem){  
	            elem.bind('click',function($event){  
	                var img = $event.srcElement || $event.target;  
	                angular.element(document.querySelector(".mask"))[0].style.display = "block";  
	                angular.element(document.querySelector(".bigPic"))[0].src = img.src;  
	            })  
	        }  
	    }  
	})  
	.directive('closePic',function(){  
	    return{  
	        restrict: "AE",  
	        link: function(scope,elem){  
	            elem.bind('click',function($event){  
	                angular.element(document.querySelector(".mask"))[0].style.display = "none";  
	            })  
	        }  
	    }  
	});  
})();


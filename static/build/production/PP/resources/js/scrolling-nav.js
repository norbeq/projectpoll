function _90e0f38ec13b17ed461fe37f1228f2ad3f8625d0(){};$(window).scroll(function(){if($(".navbar").offset().top>50){$(".navbar-fixed-top").addClass("top-nav-collapse")}else{$(".navbar-fixed-top").removeClass("top-nav-collapse")}});$(function(){$(document).on("click","a.page-scroll",function(b){var a=$(this);$("html, body").stop().animate({scrollTop:$(a.attr("href")).offset().top},1500,"easeInOutExpo");b.preventDefault()})});
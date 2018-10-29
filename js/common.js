// Куки
$(function() {
 	if (!$.cookie('hideModal')) {
    	var delay_popup = 1000;
    	setTimeout("document.querySelector('.cookie-block').style.display='inline-block'", delay_popup);
 	}
 	$.cookie('hideModal', true, {
    	expires: 30,
    	path: '/'
   });
});

// Скрытие блока с куки
$('.close-cookie').click(function(e){
    e.preventDefault();
    $('.cookie-block').fadeOut();
});


$(document).ready(function(){

	
  	// Глобальные переменные для сортировки и цены.
	let limit = 9,
		getLimit = 9,
		summPrices = 0;

	// Ссылки на стартовую загрузку каталога
    let hr = 'complectsinbed/readysets.html #tabs-content'
    let hreff = 'complectsinbed/readysets.html #modals'

    // Подгрузка каталога и модальных окон
    $('#tab-content').fadeTo(0, 0.10, loading);
    $('#hidden').fadeTo(0, 0.10, loadingModal);

    // Детальная загрузка каталога из другой страницы (при инициализации страницы)
    function loading(){
        $('#tab-content').load(hr, '', function(){
            $('#tab-content').fadeTo(0, 1);

            // Задержка для корректной отработки скриптов
            setTimeout(function(){

            	// Валидация всех форм, не связанных напрямую с заказом
            	$(".phone-form").each(function(){
			      $(this).validate({
			        errorPlacement: function(error,element) {
			            return true;
			        },
			        focusInvalid: false,
			      	rules: {
			          	name: {
			          		required: true
			          	},
						tel: {
					  		required: true
						}
			          },
			          submitHandler: function(form) {
			              var th = $(form);
			              $.ajax({
			                  type: "POST",
			                  url: "mail.php", //Change
			                  data: th.serialize()
			              }).done(function() {
			                $.magnificPopup.open({
			                    items: {
			                        src: '#phone-popup',
			                        type: 'inline'
			                  },
			                    closeBtnInside: true
			                });
			                  th.trigger("reset");
			              });
			              return false;
			          }
			      });
			    });

            	// Установка курсора в начало строки при нажатии на input tel
	    		$.fn.setCursorPosition = function(pos) {
				    if ($(this).get(0).setSelectionRange) {
				      $(this).get(0).setSelectionRange(pos, pos);
				    } else if ($(this).get(0).createTextRange) {
				      var range = $(this).get(0).createTextRange();

				      range.collapse(true);
				      range.moveEnd('character', pos);
				      range.moveStart('character', pos);
				      range.select();
				    }
				  };


				  $('input[type="tel"]').click(function(){
				    $(this).setCursorPosition(4);  // set position number
				  });

        		// lazy load
				$(function() {
					$('.lazy').lazy();
				});

				// Маска для ввода телефона (для всех инпутов)
				$('input[type="tel"]').mask("+7 (999) 999-99-99");

				// Слайдер для модалки товара
            	$('.slider-for').slick({
				  slidesToShow: 1,
				  slidesToScroll: 1,
				  lazyLoad: 'ondemand',
				  fade: true,
				  arrows: false,
				  draggable: false,
				  asNavFor: '.slider-nav'
				});
				$('.slider-nav').slick({
				  slidesToShow: 5,
				  slidesToScroll: 1,
				  lazyLoad: 'ondemand',
				  draggable: false,
				  asNavFor: '.slider-for',
				  focusOnSelect: true
				});

				// Загрузка данных из карточки в определенную модалку (при инициализации страницы)
				$('.catalog__grid-items_item').each(function(){
					let src = $(this).attr('data-mfp-src');
					let ind = $(this).find('.buy').attr('data-ind');
					let title = $(this).find('.caption').text();
					let category = $(this).find('.category').text();
					let elems = $(this).find('.texted').text();
					let price = $(this).find('.price').html();
					$(src).find('.product-popup_info-information_category').text(category);
					$(src).find('.product-popup_info-information_title').text(title);
					$(src).find('.product-popup_info-information_props .price').html(price);
					$(src).find('.product-popup_info-information_props .quantity .texted').text(elems);
					$(src).find('.product-popup_info-information_ordered').attr('data-ind', ind);
				});

				// Загрузка данных по акции в определенную модалку (при инициализации)
				$('.shares').each(function(){
					let src = $(this).attr('data-id');
					let content = $(this).html();
					$(src).find('.share-info').html(content);
				});

				// Инициализация ВСЕХ модальных окон
            	$('.open-popup').magnificPopup({
			      removalDelay: 500, 
			      callbacks: {
			        beforeOpen: function() {
			           this.st.mainClass = this.st.el.attr('data-effect');
			           $('.fixed').css('left','-8.5px'); 
			        },
			        open: function() {
			        	$('.product-popup').find('img').each(function(){
			        		let src = $(this).attr('data-src');
			        		$(this).attr('src', src);
			        	});        	

			        	// Карта в модальном окне
						if ($('#map').length > 0) {
						    ymaps.ready(init);
						    var myMap, 
						    myPlacemark;

						    function init(){ 
						        myMap = new ymaps.Map("map", {
						            center: [51.77010557372027,55.10185272883604],
						            zoom: 17,
						            controls: []
						        },{
						          suppressMapOpenBlock: true
						    }); 
						      myMap.behaviors.disable('scrollZoom'); 
						      myMap.controls.add('zoomControl');
						      myPlacemark = new ymaps.Placemark([51.77010557372027,55.10185272883604], {
						          }, {
						              iconLayout: 'default#image',
						              iconImageHref: 'img/pin.png',
						              iconImageSize: [304, 123],
						              iconImageOffset: [-155, -120]
						          });
						      
						      myMap.geoObjects.add(myPlacemark);

						    }

						  } else {
						      // не существует
					  	}

			        },
			        afterClose: function() {
			          $('.fixed').css('left','0px'); 
			        },
			      },
			      midClick: true
			    });

            	// Инициализация модалки товара
			    $('.open-prod').magnificPopup({
			      removalDelay: 100, 
			      callbacks: {
			        beforeOpen: function() {
			           this.st.mainClass = this.st.el.attr('data-effect');
			           $('.fixed').css('left','-8.5px'); 
			        },
			        open: function() {
			        	let src = $('.mfp-content').find('.product-popup').attr('id');
			        	let videoSrc = this.st.el.attr('data-video');
			        	console.log(videoSrc);
			        	console.log(src);
			        	$('#'+src).find('iframe').attr('src', videoSrc)
			        	
			        	let info = $('.mfp-content').find('.product-popup').find('.product-popup_info-information').html();
			        	let img = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]').find('.image').html();
			        	$('.mdn .mdn-content .image').html(img);
			        	$('.mdn .mdn-content .content').html(info);
			        	$('.product-popup').find('img').each(function(){
			        		let src = $(this).attr('data-src');
			        		$(this).attr('src', src);
			        	});


			        	$('.mfp-wrap').scroll(function(){
			        		if ($(this).scrollTop() > 500) {
			        			$('.mdn').fadeIn();
			        		} else {
			        			$('.mdn').fadeOut();
			        		}
			        	});		        	
			        },
			        close: function() {
						$('.mdn').hide();
						$('.mdn .mdn-content .image').empty();
			        	$('.mdn .mdn-content .content').empty();
				  	},
			        afterClose: function() {
			          $('.fixed').css('left','0px'); 
			          
			        },
			      },
			      midClick: true
			    });

            	// Обработка фильтрованных строк
            	function concatValues(obj) {
					var value = '';
					for ( var prop in obj ) {
						value += obj[ prop ];
					}
					return value;
				}

				// Открытие/закрытие списка товаров в модалке заказа
				$('.order-list').click(function(e){
					e.preventDefault();
					$(this).toggleClass('op');
					$('.order-products').toggleClass('opens');
				});

				// Загрузка данных из корзины и открытие корзины по кнопке внутри нее
				$('.fixed_menu-cart_dropdown .order-price .order').click(function(e){
					e.preventDefault();
					let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
		    		$('#order-popup').find('.order-products').html(productsInCart);
		    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
		    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
		    		$('.order-popup_mainorder .price .summ').text(summ);
		    		summ = summ.replace(/\s+/g, '');
	    			summ = Number(summ);
	    			if (summ >= 10000) {
	    				$('.order-popup_mainorder .price .prim').show();
	    			} else {
	    				$('.order-popup_mainorder .price .prim').hide();
	    			}

		    		$('.order-popup_mainorder .quantity .qua').text(quantity);
		    		
		    		$.magnificPopup.open({
		                items: {
		                    src: '#order-popup',
		                    type: 'inline'
		              	},
		              	removalDelay: 500, 
					    callbacks: {
					        beforeOpen: function() {
				           		this.st.mainClass = 'mfp-zoom-in'
				           		$('.fixed').css('left','-8.5px'); 
				           		$('.order-products').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
					        },
					        afterClose: function() {
				          		$('.fixed').css('left','0px'); 
				          		$('.order-products').removeClass('opens');
				          		$('.order-products').mCustomScrollbar("destroy")
					        },
					      },
		                closeBtnInside: true
		            });
				});


				$(".fast-form").each(function(){
					$(this).validate({
					    errorPlacement: function(error,element) {
					        return true;
					    },
					    focusInvalid: false,
					    rules: {
					      name: {
					        required: true,
					        minlength: 2,
					        maxlength: 32
					      },
					      tel: {
					        required: true,
					        minlength: 10
					      },
					      email: {
					      	required: true,
					      	email: true
					      }
					    },
					    submitHandler: function(form) {
					        var formData1 = new FormData();
							let count = 0;
							let arr = [];
							let name = $(form).find('.name-input').val();
							let tel = $(form).find('.tel-input').val();
							let mail = $(form).find('.mail-input').val();
							//let rubl = $('.catalog__grid-items_item:first-child .props-buy .props .price .rubl').text();
							//let qua = $(form).find('.order-popup_mainorder').find('.quantity').find('span.qua').text() + ' шт.';
							//let summ = $(form).find('.order-popup_mainorder').find('.price').find('span.summ').text() + ' ' + rubl;
								count++;
								let obj = {};
								let th = $(form).parents('.product-popup_info-information');
								let category = th.find('.product-popup_info-information_category').text();
								console.log(category)
								let title = th.find('.product-popup_info-information_title').text();
								let elems = th.find('.product-popup_info-information_props .quantity .texted').text();
								let price = th.find('.product-popup_info-information_props .price').find('span:first-child').text();
								obj.title = title;
								obj.category = category;
								obj.elems = elems;
								obj.price = price;
								arr.push(obj);
								formData1.append('Товары', JSON.stringify(arr));
								//formData.append('Количество', qua);
								//formData.append('Сумма', summ);
								formData1.append('Имя', name);
								formData1.append('Телефон', tel);
								formData1.append('Email', mail);
							$.ajax ({
								url: 'send.php',
								data: formData1, 
								type: 'POST', 
								processData: false,
								contentType: false,
								success: function(data){
									$.magnificPopup.open({
						                items: {
						                    src: '#thanks-popup',
						                    type: 'inline'
						              	},
						              	removalDelay: 500, 
									    callbacks: {
									        beforeOpen: function() {
								           		this.st.mainClass = 'mfp-zoom-in'
								           		$('.fixed').css('left','-8.5px'); 
								           		//$('.order-products').mCustomScrollbar();
									        },
									        afterClose: function() {
								          		$('.fixed').css('left','0px'); 
								          		//$('.order-products').removeClass('opens');
								          		$//('.order-products').mCustomScrollbar("destroy")
									        },
									      },
						                closeBtnInside: true
						            });
								}, error: function(jqXHR, textStatus, errorThrown){
		                        	alert('Error: '+ errorThrown);
		                    	}	
							});
					        return false;
					    }
				  	});
				});

				// Отправка данных о заказе из модалки заказа
				$(".order-form").validate({
				    errorPlacement: function(error,element) {
				        return true;
				    },
				    focusInvalid: false,
				    rules: {
				      name: {
				        required: true,
				        minlength: 2,
				        maxlength: 32
				      },
				      tel: {
				        required: true,
				        minlength: 10
				      },
				      email: {
				      	required: true,
				      	email: true
				      }
				    },
				    submitHandler: function(form) {
				        var formData = new FormData();
						let count = 0;
						let arr = [];
						let name = $(form).find('.name-input').val();
						let tel = $(form).find('.tel-input').val();
						let mail = $(form).find('.mail-input').val();
						let rubl = $('.catalog__grid-items_item:first-child .props-buy .props .price .rubl').text();
						let qua = $(form).find('.order-popup_mainorder').find('.quantity').find('span.qua').text() + ' шт.';
						let summ = $(form).find('.order-popup_mainorder').find('.price').find('span.summ').text() + ' ' + rubl;
					        $('.order-products .product').each(function(){
								count++;
								let obj = {};
								let th = $(this);
								let category = th.find('.category').text();
								let title = th.find('.caption').text();
								let elems = th.find('.texted').find('span').text();
								let price = th.find('.price').find('span:first-child').text();
								obj.title = title;
								obj.category = category;
								obj.elems = elems;
								obj.price = price;
								arr.push(obj);
							});
							formData.append('Товары', JSON.stringify(arr));
							formData.append('Количество', qua);
							formData.append('Сумма', summ);
							formData.append('Имя', name);
							formData.append('Телефон', tel);
							formData.append('Email', mail);
						$.ajax ({
							url: 'send.php',
							data: formData, 
							type: 'POST', 
							processData: false,
							contentType: false,
							success: function(data){
								$.magnificPopup.open({
					                items: {
					                    src: '#thanks-popup',
					                    type: 'inline'
					              	},
					              	removalDelay: 500, 
								    callbacks: {
								        beforeOpen: function() {
							           		this.st.mainClass = 'mfp-zoom-in'
							           		$('.fixed').css('left','-8.5px'); 
							           		//$('.order-products').mCustomScrollbar();
								        },
								        afterClose: function() {
							          		$('.fixed').css('left','0px'); 
							          		//$('.order-products').removeClass('opens');
							          		$//('.order-products').mCustomScrollbar("destroy")
								        },
								      },
					                closeBtnInside: true
					            });
							}, error: function(jqXHR, textStatus, errorThrown){
	                        	alert('Error: '+ errorThrown);
	                    	}	
						});
				        return false;
				    }
				  });

				// Круглая кнопка покупки в карточке товара (2 состояния)
            	$('.catalog__grid-items_item .buy').each(function(){
            		let fl = 0;
            		if ($(this).find('.buys').hasClass('visible')) {
            			fl = 1;
            		}
			    	$(this).click(function(e){
			    		e.preventDefault();
			    		e.stopPropagation();
			    		let src = $(this).parents('.catalog__grid-items_item').attr('data-mfp-src');
				    	if ($(src).find('.buys').hasClass('visible')) {
            				fl = 1;
	            		} else {
	            			fl = 0;
	            		}	
				    	if (fl == 0) {
				    		$(this).find('.buys').addClass('visible');
				    		let src = $(this).parents('.catalog__grid-items_item').attr('data-mfp-src');
				    		console.log(src);
				    		let btnSrc = $(this).attr('data-ind');
				    		let btn = $('.mdn').find('a[data-ind="'+ btnSrc +'"]');
				    		btn.find('.buys').addClass('visible');
				    		btn.find('span').text('Оформить заказ');
				    		$(src).find('.product-popup_info-information_ordered').find('span').text('Оформить заказ');
				    		$(src).find('.buys').addClass('visible');
				    		$('.fixed_menu-cart').addClass('mayopen');
				    		let $product = $(this).parents('.catalog__grid-items_item');
				    		let category = $product.find('.category').text();
				    		let caption = $product.find('.caption').text();
				    		let imageHref = $product.find('.image').find('img').attr('src');
				    		let quantity = $product.find('.quantity').html();
				    		let price = $product.find('.price').html();
				    		let index = $(this).attr('data-ind');
				    		$('.fixed_menu-cart').find('.products-content').append('<div class="product" data-ind="'+  index +'"><div class="image"><img src="'+ imageHref +'"></div><div class="text"><div class="category">'+ category +'</div><div class="caption">'+ caption +'</div></div><div class="elem-price"><div class="elems">'+ quantity +'</div><div class="price">'+ price +'</div></div><div class="delete"></div></div>');
				    		let amount = $('.products-content').find('.product').length;
				    		$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

				    		$('.fixed_menu-cart .icon span').addClass('vis').text(amount);
				    		let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
			    			$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

			    			let priceValue = $product.find('.price').find('span:nth-child(1)').text();
			    			priceValue = priceValue.replace(/\s+/g, '');
			    			priceValue = Number(priceValue);
			    			summPrices += priceValue;


			    			if (summPrices >= 10000) {
			    				$('.offer').css('display','flex');
			    			} else {
			    				$('.offer').css('display','none');
			    			}

			    			let summ = String(summPrices);
			    			summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
			    			$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


				    		if ($('.product').length > 3) {   			
				    			$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
				    		} else {
				    		}
				    		$('.products-content').mCustomScrollbar("destroy");
				    		$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
				    			


				    		fl = 1;
				    	} else {
				    		let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
				    		$('#order-popup').find('.order-products').html(productsInCart);
				    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
				    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
				    		$('.order-popup_mainorder .price .summ').text(summ);
				    		summ = summ.replace(/\s+/g, '');
			    			summ = Number(summ);
			    			if (summ >= 10000) {
			    				$('.order-popup_mainorder .price .prim').show();
			    			} else {
			    				$('.order-popup_mainorder .price .prim').hide();
			    			}

				    		$('.order-popup_mainorder .quantity .qua').text(quantity);
				    		
				    		$.magnificPopup.open({
				                items: {
				                    src: '#order-popup',
				                    type: 'inline'
				              	},
				              	removalDelay: 500, 
							    callbacks: {
							        beforeOpen: function() {
						           		this.st.mainClass = 'mfp-zoom-in'
						           		$('.fixed').css('left','-8.5px'); 
						           		$('.order-products').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
							        },
							        afterClose: function() {
						          		$('.fixed').css('left','0px'); 
						          		$('.order-products').removeClass('opens');
						          		$('.order-products').mCustomScrollbar("destroy")
							        },
							      },
				                closeBtnInside: true
				            });
				    		fl = 0;
				    	}
			    	});
			    });

				// Клик по кнопке "добавить в корзину" внутри модалки товара (2 состояния)
			    $('.product-popup_info-information_ordered').each(function(){
            		//let fl = 0;
            		let src = $(this).parents('.product-popup').attr('id');
		    		let $product = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]');
			    	$(this).click(function(e){
			    		e.preventDefault();
			    		e.stopPropagation();
			    		console.log('asd')
			    		if ($product.find('.buys').hasClass('visible')) {
            				fl = 1;
	            		} else {
	            			fl = 0;
	            		}	
				    	if (fl == 0) {
				    		let lineSrc = $(this).attr('data-ind');
		    				let lineBtn = $('.mdn').find('a[data-ind="'+ lineSrc +'"]');
		    				$(lineBtn).find('.buys').addClass('visible');
		    				$(lineBtn).find('span').text('Оформить заказ');
				    		$(this).find('.buys').addClass('visible');
				    		$(this).find('span').text('Оформить заказ');
				    		$('.fixed_menu-cart').addClass('mayopen');			    			
				    		let src = $(this).parents('.product-popup').attr('id');
				    		let $product = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]');
				    		$product.find('.buys').addClass('visible');
				    		let category = $product.find('.category').text();
				    		let caption = $product.find('.caption').text();
				    		let imageHref = $product.find('.image').find('img').attr('src');
				    		let quantity = $product.find('.quantity').html();
				    		let price = $product.find('.price').html();
				    		let index = $(this).attr('data-ind');
				    		$('.fixed_menu-cart').find('.products-content').append('<div class="product" data-ind="'+  index +'"><div class="image"><img src="'+ imageHref +'"></div><div class="text"><div class="category">'+ category +'</div><div class="caption">'+ caption +'</div></div><div class="elem-price"><div class="elems">'+ quantity +'</div><div class="price">'+ price +'</div></div><div class="delete"></div></div>');
				    		let amount = $('.product').length;
				    		$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

				    		$('.fixed_menu-cart .icon span').addClass('vis').text(amount);
				    		let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
			    			$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

			    			let priceValue = $product.find('.price').find('span:nth-child(1)').text();
			    			priceValue = priceValue.replace(/\s+/g, '');
			    			priceValue = Number(priceValue);
			    			summPrices += priceValue;


			    			if (summPrices >= 10000) {
			    				$('.offer').css('display','flex');
			    			} else {
			    				$('.offer').css('display','none');
			    			}

			    			let summ = String(summPrices);
			    			summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
			    			$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


				    		if ($('.product').length > 3) {   			
				    			$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
				    		} else {
				    		}
				    		$('.products-content').mCustomScrollbar("destroy");
				    		$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
				    			


				    		fl = 1;
				    	} else {
				    		let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
				    		$('#order-popup').find('.order-products').html(productsInCart);
				    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
				    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
				    		$('.order-popup_mainorder .price .summ').text(summ);
				    		summ = summ.replace(/\s+/g, '');
			    			summ = Number(summ);
			    			if (summ >= 10000) {
			    				$('.order-popup_mainorder .price .prim').show();
			    			} else {
			    				$('.order-popup_mainorder .price .prim').hide();
			    			}

				    		$('.order-popup_mainorder .quantity .qua').text(quantity);
				    		
				    		//$('.order-products').mCustomScrollbar();
				    		$.magnificPopup.open({
				                items: {
				                    src: '#order-popup',
				                    type: 'inline'
				              	},
				              	removalDelay: 500, //delay removal by X to allow out-animation
							    callbacks: {
							        beforeOpen: function() {
						           		this.st.mainClass = 'mfp-zoom-in'
						           		$('.fixed').css('left','-8.5px'); 
						           		//$('.order-products').mCustomScrollbar("update")
						           		$('.order-products').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
							        },
							        afterClose: function() {
						          		$('.fixed').css('left','0px'); 
						          		$('.order-products').removeClass('opens');
						          		$('.order-products').mCustomScrollbar("destroy")
							        },
							      },
				                closeBtnInside: true
				            });
				    		fl = 0;
				    	}
			    	});
			    });

				// Клик по кнопке "добавить в корзину" внутри ездящей полоски
		    	$('body').on('click','.mdn .mdn-content .content a',function(e){
		    		let src = $(this).attr('data-ind');
	    			let $product = $('.buy[data-ind="'+ src +'"]').parents('.catalog__grid-items_item');
	    			let $prodBtn = $('.product-popup').find('[data-ind="'+ src +'"]');
		    		e.preventDefault();
		    		e.stopPropagation();
		    		if ($product.find('.buys').hasClass('visible')) {
        				fl = 1;
            		} else {
            			fl = 0;
            		}	
			    	if (fl == 0) {
			    		$(this).find('.buys').addClass('visible');
			    		$(this).find('span').text('Оформить заказ');
			    		$('.fixed_menu-cart').addClass('mayopen');			    			
			    		$product.find('.buys').addClass('visible');
			    		$prodBtn.find('.buys').addClass('visible');
			    		$prodBtn.find('span').text('Оформить заказ');
			    		let category = $product.find('.category').text();
			    		let caption = $product.find('.caption').text();
			    		let imageHref = $product.find('.image').find('img').attr('src');
			    		let quantity = $product.find('.quantity').html();
			    		let price = $product.find('.price').html();
			    		let index = $(this).attr('data-ind');
			    		$('.fixed_menu-cart').find('.products-content').append('<div class="product" data-ind="'+  index +'"><div class="image"><img src="'+ imageHref +'"></div><div class="text"><div class="category">'+ category +'</div><div class="caption">'+ caption +'</div></div><div class="elem-price"><div class="elems">'+ quantity +'</div><div class="price">'+ price +'</div></div><div class="delete"></div></div>');
			    		let amount = $('.product').length;
			    		$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

			    		$('.fixed_menu-cart .icon span').addClass('vis').text(amount);
			    		let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
		    			$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

		    			let priceValue = $product.find('.price').find('span:nth-child(1)').text();
		    			priceValue = priceValue.replace(/\s+/g, '');
		    			priceValue = Number(priceValue);
		    			summPrices += priceValue;


		    			if (summPrices >= 10000) {
		    				$('.offer').css('display','flex');
		    			} else {
		    				$('.offer').css('display','none');
		    			}

		    			let summ = String(summPrices);
		    			summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		    			$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


			    		if ($('.product').length > 3) {   			
			    			$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
			    		} else {
			    		}
			    		$('.products-content').mCustomScrollbar("destroy");
			    		$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
			    			


			    		fl = 1;
			    	} else {
			    		let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
			    		$('#order-popup').find('.order-products').html(productsInCart);
			    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
			    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
			    		$('.order-popup_mainorder .price .summ').text(summ);
			    		summ = summ.replace(/\s+/g, '');
		    			summ = Number(summ);
		    			if (summ >= 10000) {
		    				$('.order-popup_mainorder .price .prim').show();
		    			} else {
		    				$('.order-popup_mainorder .price .prim').hide();
		    			}

			    		$('.order-popup_mainorder .quantity .qua').text(quantity);
			    		
			    		//$('.order-products').mCustomScrollbar();
			    		$.magnificPopup.open({
			                items: {
			                    src: '#order-popup',
			                    type: 'inline'
			              	},
			              	removalDelay: 500, //delay removal by X to allow out-animation
						    callbacks: {
						        beforeOpen: function() {
					           		this.st.mainClass = 'mfp-zoom-in'
					           		$('.fixed').css('left','-8.5px'); 
					           		//$('.order-products').mCustomScrollbar("update")
					           		$('.order-products').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
						        },
						        afterClose: function() {
					          		$('.fixed').css('left','0px'); 
					          		$('.order-products').removeClass('opens');
					          		$('.order-products').mCustomScrollbar("destroy")
						        },
						      },
			                closeBtnInside: true
			            });
			    		fl = 0;
			    	}
		    	});

				// Обработка удаления товара из корзины (по кнопке удалить в каждом товаре)
			    $('body').on('click','.fixed_menu-cart_dropdown .products-content .product .delete',function(e){
			    	e.preventDefault();
			    	let $parent = $(this).parents('.product');
			    	$parent.remove();
			    	let $product = $(this).parents('.product');
					let category = $product.find('.category').text();
					let caption = $product.find('.caption').text();
					let imageHref = $product.find('.image').find('img').attr('src');
					let quantity = $product.find('.quantity').html();
					let price = $product.find('.price').html();
					let index = $product.attr('data-ind');

					$('.buy[data-ind="'+ index +'"').find('.buys').removeClass('visible');
					$('.product-popup_info-information_ordered[data-ind="'+ index +'"').find('.buys').removeClass('visible');
					$('.mdn .mdn-content a[data-ind="'+ index +'"').find('.buys').removeClass('visible');

			    	if ($('.fixed_menu-cart_dropdown .products-content .product').length < 1) {
			    		$('.fixed_menu-cart').removeClass('mayopen');
			    	}
					
					
					let amount = $('.fixed_menu-cart_dropdown .products-content .product').length;
					//amount--;
					if (amount == 0) {
						$('.fixed_menu-cart .icon span').removeClass('vis');
						$('.basket-overlay').removeClass('basket-open');
					}
					$('.fixed_menu-cart .icon span').text(amount);
					$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

					let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
					$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

					let priceValue = $product.find('.price').find('span:nth-child(1)').text();
					priceValue = priceValue.replace(/\s+/g, '');
					priceValue = Number(priceValue);
					summPrices -= priceValue;


					if (summPrices >= 10000) {
						$('.offer').css('display','flex');
					} else {
						$('.offer').css('display','none');
					}

					let summ = String(summPrices);
					summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
					$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


					if ($('.product').length > 3) {
						
						$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
					} else {
					}
					$('.products-content').mCustomScrollbar("destroy");
					$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
			    });
			    	
			    // Подстановка слов в зависимости от числа (1 товар, 2 товара, 5 товаров)
			    function declOfNum(number, titles) {  
				    var cases = [2, 0, 1, 1, 1, 2];  
				    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
				}

				// Задаем переменные для фильтрации
				let $grid = $('.catalog__grid-items'),
				$item = $('.catalog__grid-items_item')
				filterButtons = $('.catalog__grid-sort'),
				showMore = $('.catalog__grid-more'),
				filters = {},
				filterValue = '',
				filtered = '';

				// hideElementToLimit и firstSort - начальные состояния каталога при загрузке страницы
				function hideElementToLimit() {
					$($item).hide();
					for (let i = 0; i < $item.length; i++) {
						if (i <= limit-1) {
							$($item[i]).show();
							showMore.css('opacity', '0');
						} else {
							showMore.css('opacity', '1');
						}
					}
				}

				function firstSort() {
					$item.sortElements(function(a, b){
						return parseInt($(a).find('.price').find('span:first-child').text().replace(/\s/g, '')) > parseInt($(b).find('.price').find('span:first-child').text().replace(/\s/g, '')) ? 1 : -1;
					});
				}

				firstSort();
				hideElementToLimit();
				

				// Передача класса селект выбранному фильтру
				$('.button-group').each( function(i, buttonGroup) {
					var $buttonGroup = $( buttonGroup );
					$buttonGroup.on('click', '.button', function(event) {
						$buttonGroup.find('.select').removeClass('select');
						var $button = $(event.currentTarget);
						$button.addClass('select');
					});
				});

				// Фильтрация (пол, форма, сезон)
				filterButtons.on('click','.button', function(e){
					e.preventDefault();
					$grid.fadeOut('fast');
					let $button = $(e.currentTarget);
					let $buttonGroup = $button.parents('.button-group');
					let filterGroup = $buttonGroup.attr('data-filter-group');
					filters[filterGroup] = $button.attr('data-filter');
					filterValue = concatValues(filters);
					filtered = $item.filter(filterValue);
					let length = filtered.length;
					$item.hide();
					limit = getLimit;
					limit = limit - 1;
					if (length == 0) {
						$('.catalog__grid-zero').css('display','flex');
						showMore.css('opacity', '0');
					} else {
						$('.catalog__grid-zero').css('display','none');
						//showMore.css('opacity', '0');
					}
					for (let i = 0; i < length; i++) {
						if (i <= limit) {
							$(filtered[i]).show();
							showMore.css('opacity', '0');
						} else {
							showMore.css('opacity', '1');
						}
					}
					$grid.fadeIn('slow');	
				});

				// Сортировка
				$('[data-option]').click(function(e){
					e.preventDefault();
					$grid.fadeOut('fast');
					$('[data-option]').removeClass('select');
					$(this).addClass('select');
					let type = $(this).attr('data-sorttype');
				    let option = $(this).attr('data-option');
				    if (option == 'price') {
				    	if (type == 'ass') {
				    		$item.sortElements(function(a, b){
								return parseInt($(a).find('.price').find('span:first-child').text().replace(/\s/g, '')) > parseInt($(b).find('.price').find('span:first-child').text().replace(/\s/g, '')) ? 1 : -1;
							});
					    } else {
					    	$item.sortElements(function(a, b){
								return parseInt($(a).find('.price').find('span:first-child').text().replace(/\s/g, '')) < parseInt($(b).find('.price').find('span:first-child').text().replace(/\s/g, '')) ? 1 : -1;
							});
					    }
				    } else {
				    	$item.sortElements(function(a, b){
							return parseInt($(a).find('.texted').find('span').text().replace(/\s/g, '')) > parseInt($(b).find('.texted').find('span').text().replace(/\s/g, '')) ? 1 : -1;
						});
				    }    
				    $grid.fadeIn('slow');
				});

				// Кнопка показать еще
				$('.catalog__grid-more .more').click(function(e){
					e.preventDefault();
					if (jQuery.isEmptyObject(filters) == true) {
						limit = limit + limit;
						hideElementToLimit();
					} else {
						filtered = $item.filter(filterValue);
						let length = filtered.length;
						$item.hide();
						limit = getLimit;
						limit = limit + limit;
						limit = limit - 1;
						for (let i = 0; i < length; i++) {
							if (i <= limit) {
								$(filtered[i]).show();
								showMore.css('opacity', '0');
							} else {
								showMore.css('opacity', '1');
							}
						}
					}
				});
				
				// Сортировка по кол-ву
				$('.catalog__grid-actions_quantity .dropdown a').click(function(e){
					e.preventDefault();
					$('.catalog__grid-actions_quantity .dropdown a').removeClass('select');
					$(this).addClass('select');
					getLimit = $(this).attr('data-filter');
					if (jQuery.isEmptyObject(filters) == true) {
						$grid.fadeOut('fast');
						limit = getLimit;
						hideElementToLimit();
						$grid.fadeIn('slow');
					} else {
						$grid.fadeOut('fast');
						filtered = $item.filter(filterValue);
						let length = filtered.length;
						$item.hide();
						limit = getLimit;
						limit = limit - 1;
						for (let i = 0; i < length; i++) {
							if (i <= limit) {
								$(filtered[i]).show();
								showMore.css('opacity', '0');
							} else {
								showMore.css('opacity', '1');
							}
						}
						$grid.fadeIn('slow');
					}
				});

				// Сброс фильтров
				$('.catalog__grid-actions_reset').on('click', function(e){
					e.preventDefault();
					$grid.fadeOut('fast');
					$('.catalog__grid-sort_gender .link span').text('Пол ребенка');
					$('.catalog__grid-sort_gender .dropdown a').removeClass('select');
					$('.catalog__grid-sort_form .link span').text('Форма кроватки');
					$('.catalog__grid-sort_form .dropdown a').removeClass('select');
					$('.catalog__grid-sort_season .link span').text('Сезон');
					$('.sort').removeClass('selected');
					$('.catalog__grid-sort_season .dropdown a').removeClass('select');
					$('.catalog__grid-zero').css('display','none');
					limit = limit + 1;
					hideElementToLimit();
					filters = {};
					$grid.fadeIn('slow');	
				});

            },100);
        })
    }
    // Подгрузка данных о модальных окнах из других страниц
    function loadingModal(){
        $('#hidden').load(hreff, '', function(){
            $('#hidden').fadeTo(0, 1);
        })
    }

    // Перевод картинки в фон для карточки команды
    $('.team__content-item .image img').each(function(){
		let src = $(this).attr('data-src');
		console.log(src);
		$(this).parents('.image').css('background-image', 'url(' + src + ')');
	});

    // Передача данных и открытие модального окна команды
	$(function() {
	    $("[data-dot]").dotdotdot({
	        
	        //callback: dotdotdotCallback
	    });

	    $(".team__content-item .text a").on('click',function(e) {
	    	e.preventDefault();
	      	$(this).parents('.team__content-item').find('[data-dot]').css("max-height", "96px").dotdotdot({ after: "a.more", callback: dotdotdotCallback });
	    });

	    function dotdotdotCallback(isTruncated, originalContent) {
	      let a = $(this).parents('.team__content-item');
	      $('.team-popup > .popup-content').find('.team-text').removeAttr('data-dot');
	      $('.team-popup > .popup-content').find('.team-text').removeAttr('style');
	      $.magnificPopup.open({
	          items: {
	              src: '#team-popup',
	              type: 'inline'
	        },
	        removalDelay: 500,
	        callbacks: {
	          beforeOpen: function() {
	            $('.fixed').css('left','-8.5px'); 
	            $('.team-popup > .popup-content').html(a.html());
	            setTimeout(function(){
	              $('.team-popup > .popup-content').find('.team-text').html(originalContent);
	              $('.team-popup > .popup-content').find('.team-text').trigger('destroy');
	            },100);
	          },
	          open: function() {
	            $('.mfp-wrap').addClass('mfp-zoom-in');
	          },
	          beforeClose: function() {
	            
	            $('.team-popup > .popup-content').empty();
	          },
	          afterClose: function() {
	            $('.fixed').css('left','0'); 
	            $('.mfp-wrap').removeClass('mfp-zoom-in');
	          }
	        }
	      });
	    }
  	});
    

	// Аякс-запрос для серверной даты
	var year, month, day2, daysInMonth;
	$.ajax({
		type: "POST",
		url: "date.php",
		dataType: "json",
		cache: false,
		success: function(data){
			if (data.status == 'ok') {
				year = data.server_datetimeY;
				console.log(year);
				month = data.server_datetimeM;
				console.log(month);
				day2 = data.server_datetimeD;
				console.log(day2);
				daysInMonth = data.server_datetimeT;
				console.log(daysInMonth)
				localStorage['ServeTime'] = data.server_datetimeM;
			}
		}
	});

	// Задержка для корректного определения серверных дат
	setTimeout(function(){

		// Массив месяцев (для акций)
		var arr=[ 
			'Январь', 
			'Февраль', 
			'Март', 
			'Апрель', 
			'Май', 
			'Июнь', 
			'Июль', 
			'Август', 
			'Сентябрь', 
			'Октябрь',
			'Ноябрь', 
			'Декабрь', 
		]; 

		// Массив для id
		var arrId=[ 
			'january', 
			'february', 
			'march', 
			'april', 
			'may', 
			'june', 
			'july', 
			'august', 
			'september', 
			'october',
			'november', 
			'december', 
		]; 

		// Массив месяцев в род. падеже (для меню)
		let arrGenitive = [
			'января', 
			'февраля', 
			'марта', 
			'апреля', 
			'мая', 
			'июня', 
			'июля', 
			'августа', 
			'сентября', 
			'октября',
			'ноября', 
			'декабря', 
		];

		// перевод строки в число
		month = Number(month);
		daysInMonth = Number(daysInMonth);
		day2 = Number(day2);

		month = 10; // УБРАТЬ
		year = 2018; // УБРАТЬ

		// Номер текущего месяца и отсчет 6 месяцев ранее
		let actualNumberMonth = month;
		let startMonth = actualNumberMonth - 6;

		// Вывод года в акцию
		$('.autodate').text(year);

		// Текущий месяц
		let actualMonth = arr[month-1];

		
		// Вывод иконки времени года в главное меню
		if (actualNumberMonth == 12) {
			$('.share-lnk').find('.icon').find('img').attr('src', 'img/winter.svg');
		} else if (actualNumberMonth == 1) {
			$('.share-lnk').find('.icon').find('img').attr('src', 'img/winter.svg');
		} else if (actualNumberMonth == 2) {
			$('.share-lnk').find('.icon').find('img').attr('src', 'img/winter.svg');
		} else if (actualNumberMonth >=3 && actualNumberMonth <= 5) {
			$('.share-lnk').find('.icon').find('img').attr('src', 'img/spring.svg');
		} else if (actualNumberMonth >= 6 && actualNumberMonth <= 8) {
			$('.share-lnk').find('.icon').find('img').attr('src', 'img/summer.svg');
		} else if (actualNumberMonth >= 9 && actualNumberMonth <= 11) {
			$('.share-lnk').find('.icon').find('img').attr('src', 'img/autumn.svg');
		}

		
		// Вывод всех месяцев в списке
		for (let i = 0; i <arr.length;i++) {
			$('.share__tabs-nav ul').append('<li data-index="' +Number(i+ 1) + '"><a href="#' +arrId[i]+ '">' +arr[i]+ '</a></li>');
		}

		// Табы акций (по текущему и последним 6 месяцам)
		$('body').on('click','.share__tabs-nav a',function(){
		    $('.share__tabs-nav li').removeClass('active');
		    $(this).parents('li').addClass('active');
		    var href = $(this).attr('href');
		    $('.share__tabs-pane').removeClass('current').removeClass('in');
		    var id = $(href).addClass('current');
		    setTimeout(function(){
		      $(href).addClass('in');
		    }, 200);
		    return false;
	  	});

		// Вывод названия текущего месяца в меню в род. падеже
		$('.fixed_menu-nav ul li a span').text(arrGenitive[actualNumberMonth-1]);

		// Вывод 6ти последних месяцев в акции
		for (let i = startMonth; i <= actualNumberMonth;i++) {
			console.log(i);
			$('.share__tabs-nav ul li').each(function(){
				let index = $(this).attr('data-index');
				index = Number(index);
				if (index == i)
					$(this).css('display','inline-block');
				if (index == actualNumberMonth) {
					$(this).addClass('actual').addClass('active');
				} 
			});
		}

		actualNumberMonth = 10; // УБРАТЬ

		// Присвоение класса для текущего месяца (а так же класса неактуальных акций для предыдущих 6-ти месяцев)
		$('.share__tabs-pane').each(function(){
			let index = $(this).attr('data-index');
			index = Number(index);
			$(this).addClass('non-actual');
			if (index == actualNumberMonth) {
				$(this).removeClass('non-actual');
				$(this).addClass('actual').addClass('in').addClass('current');	
			} 
		});

		// То же самое для соответствующих модальных окон
		$('.share-popup').each(function(){
			let index = $(this).attr('data-month');
			index = Number(index);
			$(this).addClass('non-actual');
			if (index == actualNumberMonth) {
				$(this).removeClass('non-actual');
				$(this).addClass('actual');	
			} 
		});

		// Подстановка слов в зависимости от числа (1 товар, 2 товара, 5 товаров)
		function declOfNum(number, titles) {  
		    var cases = [2, 0, 1, 1, 1, 2];  
		    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
		}

		// Количество дней в данном месяце
		let daysInActual = daysInMonth;

		daysInActual = 31; // УБРАТЬ

		// Номер текущего дня
		let day = day2;

		day = 26; // УБРАТЬ


		// Если день = с 1 по 15 число - делаем одно. Если с 16го по конец месяца - другое.
		if (day >= 1 && day <= 15) {
			$('.share__tabs-pane.actual').find('.share-1').addClass('active-share');
			$('.share__tabs-pane.actual').find('.share-2').addClass('non-active-share');
			$('.share-popup.actual').find('.share-info-1').addClass('active-share');
			$('.share-popup.actual').find('.share-info-2').addClass('non-active-share');
		} else if (day >= 16 && day <= daysInActual) {
			$('.share__tabs-pane.actual').find('.share-1').addClass('end-share');
			$('.share__tabs-pane.actual').find('.share-2').addClass('active-share');
			$('.share-popup.actual').find('.share-info-1').addClass('end-share');
			$('.share-popup.actual').find('.share-info-2').addClass('active-share');
		}
		
		// Задержка для корректного выполнения функции (здесь определенному модальному окну дается класс законченной акции, если акция, полученная извне - закончилась)
		setTimeout(function(){
			$('.share-info-1.end-share').each(function(){
				$(this).parents('.share-popup').addClass('end-popup');
			});
			$('.share-info-2.end-share').each(function(){
				$(this).parents('.share-popup').addClass('end-popup');
			});
		},100)
		
		// Получение остатка дней до конце 1й акции в месяце
		var toEndAction1 = 15 - day;
		var toEndActionText1 = declOfNum(toEndAction1, ['день', 'дня', 'дней']);

		// Получение остатка дней до конце 1й акции в месяце
		var toEndAction2 = daysInActual - day;
		var toEndActionText2 = declOfNum(toEndAction2, ['день', 'дня', 'дней']);

		// Передача этих данных в карточку и модальное окно
		$('.share__tabs-pane.actual .share-1.active-share .to-share').find('.days').text(toEndAction1);
		$('.share__tabs-pane.actual .share-1.active-share .to-share').find('.days-text').text(toEndActionText1);
		$('.share-popup.actual .share-info-1 .text .share-content .btn-area .to-share .days').text(toEndAction1);
		$('.share-popup.actual .share-info-1 .text .share-content .btn-area .to-share .days-text').text(toEndActionText1);


		$('.share__tabs-pane.actual .share-2.active-share .to-share').find('.days').text(toEndAction2);
		$('.share__tabs-pane.actual .share-2.active-share .to-share').find('.days-text').text(toEndActionText2);
		$('.share-popup.actual .share-info-2 .text .share-content .btn-area .to-share .days').text(toEndAction2);
		$('.share-popup.actual .share-info-2 .text .share-content .btn-area .to-share .days-text').text(toEndActionText2);

		// Если дней до конца акции 5 или меньше - показываем это предупреждение
		if (toEndAction1 <= 5) {
			$('.share__tabs-pane.actual .share-1.active-share .to-share').show();
			$('.share-popup.actual .share-info-1.active-share .text .share-content .btn-area .to-share').show();
		} else {
			$('.share__tabs-pane.actual .share-1.active-share .to-share').hide();
			$('.share-popup.actual .share-info-1.active-share .text .share-content .btn-area .to-share').hide();
		}

		if (toEndAction2 <= 5) {
			$('.share__tabs-pane.actual .share-2.active-share .to-share').show();
			$('.share-popup.actual .share-info-2.active-share .text .share-content .btn-area .to-share').show();
		} else {
			$('.share__tabs-pane.actual .share-2.active-share .to-share').hide();
			$('.share-popup.actual .share-info-2.active-share .text .share-content .btn-area .to-share').hide();
		}
	},300);
	
	// Открытие формы быстрого заказа (в модалке каждого товара)
	$('body').on('click','.product-popup_info-information_fast-order_link', function(e){
		e.preventDefault();
		$(this).find('.icon').toggleClass('pov');
		$('.product-popup_info-information_fast-order_form').toggleClass('opened');
	});

	// Появление/закрытие своего оверлея при наведении на корзину
	$('body').on('mouseenter','.mayopen', function(e){
		$('.basket-overlay').addClass('basket-open');
	})

	$('body').on('mouseleave','.mayopen', function(e){
		$('.basket-overlay').removeClass('basket-open');
	})


	// Получение различных состояний для фукнций прокрутки
	let heg = $('.fixed_menu').offset().top;
	let wh = $(window).height();
	let hg = $('.team').offset().top;
	let het = $('.fixed_menu').height();

	// Приклеивание меню при прокрутке
	$(window).scroll(function(event) {
	    if($(this).scrollTop() > heg) {
	    	$('.fixed_menu').addClass('fixed');
	    	$('.catalog').css('padding-top', het);
	    	return false;
		}
		else {
	    	$('.fixed_menu').removeClass('fixed');
	    	$('.catalog').css('padding-top', '0');
	 	}
	});  

	

	

	// Запуск видео внизу сайта при определенном положении скролла
	$(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll touchmove', function(event){
		if($(this).scrollTop() > hg - 500) {

			// Подгрузка картинок из инсты
			var userFeed = new Instafeed({
		      get: 'user',
		      userId: '2324856506',
		      limit: '8',
		      resolution: 'standard_resolution',
		      template: '<a href="{{link}}" class="instafeed-block" target="_blank" style="background-image:url({{image}})"><div class="hovered"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0 0 28 28"><defs><path id="bq5ta" d="M1063 9155a13 13 0 0 1 9.87 21.46l4.82 4.82a1 1 0 1 1-1.41 1.41l-4.82-4.82A13 13 0 1 1 1063 9155zm-11 13a11 11 0 1 0 22 0 11 11 0 0 0-22 0z"/></defs><g><g transform="translate(-1050 -9155)"><use fill="#fff" xlink:href="#bq5ta"/></g></g></svg></div></a>',
		      accessToken: '2324856506.1677ed0.272a20028bb94b41b324d56ef28d3ab0'
		    });
			
			userFeed.run();

			

	 		$('.scroll-video').each(function () {
				var video = $(this);
				var src = video.attr('src');
				if (src=='#') {
					video.attr('src',video.attr('data-src'));
				}
				if (video.get(0).paused) {
					video.get(0).play();
				}
			});
			//return false;
			$(window).unbind('mousewheel DOMMouseScroll MozMousePixelScroll touchmove');
	 	}
	});

	// Определение положения кнопки "к каталогу" по горизонтальной оси
	let hs = $('.cont-share').offset().left;
	console.log(hs)
	$('.to-cat').css('width',hs);
	$('.to-catalog').css('left', hs-60)

	

	// Показ\скрытие кнопки "к каталогу"
	let hh = $('.team').height();
	let hss = $('.image-line').offset().top;
	let hhh = hss + (hh/2);
	$('.catalog__grid-more .more').click(function(e){
		e.preventDefault();
		setTimeout(function(){
			hss = $('.image-line').offset().top;
		},300);
	});
	$(window).scroll(function(event) {
		hhh = hss + (hh/2);
 		if($(this).scrollTop() >= hhh) {
	 		//$('.to-catalog').addClass('to-show');
	 		$('.to-cat').fadeIn();
			return false;
	 	} else {
	 		//$('.to-catalog').removeClass('to-show');
	 		$('.to-cat').fadeOut();
	 	}
	}); 

	// Подсветка актуального класса у меню, если находимся на нужной секции (+ езда по якорям при нажатии)
	$('.fixed_menu-nav ul').onePageNav({
		currentClass: 'active',
		changeHash: false,
		scrollSpeed: 750,
		scrollThreshold: 0.5,
		filter: '',
		easing: 'swing',
  	});

	// Открываем сортировку
	$('.sort .link').on('click', function(e){
		e.preventDefault();
		$(this).parents('.sort').addClass('opens');
		$(this).parents('.sort').find('.dropdown').addClass('opened');
	});

	// Закрываем сортировку после выбора
	$('.sort .dropdown a').on('click', function(e){
		e.preventDefault();
		let text = $(this).text();
		$(this).parents('.sort').removeClass('opens');
		$(this).parents('.sort').find('span').text(text);
		$(this).parents('.sort').addClass('selected');
		$(this).parents('.dropdown').removeClass('opened');
	});

	// Открываем фильтр
	$('.sorting a').on('click', function(e){
		e.preventDefault();
		$(this).toggleClass('opened');
		$(this).parents('.sorting').find('.dropdown').toggleClass('opened');
	});

	// Закрываем фильтр после выбора
	$('.sorting .dropdown a').on('click', function(e){
		e.preventDefault();
		let text = $(this).text();
		$(this).parents('.sorting').find('.choice').text(text);
		$(this).parents('.dropdown').find('.default-value').text(text);
		$(this).parents('.sorting').find('a').removeClass('opened');
		$(this).parents('.sorting').find('.dropdown').removeClass('opened');
	});

	// Закрываем открытую сортировку/фильтр при клике в любом место сайта (кроме самой выпадашки фильтра/сортировки)
	$(document).mouseup(function (e){
		var div = $(".sorting .dropdown");
		var divv = $('.sort .dropdown');
		if (div.hasClass('opened')) {
			if (!div.is(e.target) && div.has(e.target).length === 0) {
				div.removeClass('opened');
			}
		}
		if (divv.hasClass('opened')) {
			if (!divv.is(e.target) && divv.has(e.target).length === 0) {
				divv.parents('.sort').removeClass('opens')
				divv.removeClass('opened');
			}
		}
	});

	

	
	// AJAX-перезагрузка каталога (по сути повторение загрузки изначально)
	$('body').on('click','.catalog__nav-sect ul li button',function(e){
		e.preventDefault();
	    $('.catalog__nav-sect ul li button').removeClass('active');
	    $(this).addClass('active');
	    var href = $(this).attr('data-href')+ ' #tabs-content';
	    var hreff = $(this).attr('data-href')+ ' #modals';
	    $('#tab-content').fadeTo(500, 0.10, loading);
	    $('#hidden').fadeTo(500, 0.10, loadingModal);
	    $('.catalog__grid-actions_price .choice').text('по возрастанию цены');
	    $('.catalog__grid-actions_price .dropdown .default-value').text('по возрастанию цены');
	    $('.catalog__grid-actions_price .dropdown a').removeClass('select');
	    $('#аscending').addClass('select');
	    function loading(){
	        $('#tab-content').load(href, '', function(){
	            $('#tab-content').fadeTo(500, 1);

	            setTimeout(function(){


	            	$(".phone-form").each(function(){
				      $(this).validate({
				        errorPlacement: function(error,element) {
				            return true;
				        },
				        focusInvalid: false,
				      	rules: {
				          	name: {
				          		required: true
				          	},
							tel: {
						  		required: true
							}
				          },
				          submitHandler: function(form) {
				              var th = $(form);
				              $.ajax({
				                  type: "POST",
				                  url: "mail.php", //Change
				                  data: th.serialize()
				              }).done(function() {
				                $.magnificPopup.open({
				                    items: {
				                        src: '#phone-popup',
				                        type: 'inline'
				                  },
				                    closeBtnInside: true
				                });
				                  th.trigger("reset");
				              });
				              return false;
				          }
				      });
				    });

	            	$.fn.setCursorPosition = function(pos) {
					    if ($(this).get(0).setSelectionRange) {
					      $(this).get(0).setSelectionRange(pos, pos);
					    } else if ($(this).get(0).createTextRange) {
					      var range = $(this).get(0).createTextRange();

					      range.collapse(true);
					      range.moveEnd('character', pos);
					      range.moveStart('character', pos);
					      range.select();
					    }
				  	};


				  $('input[type="tel"]').click(function(){
				    $(this).setCursorPosition(4);  // set position number
				  });

	            	// lazy load
					$(function() {
						$('.lazy').lazy();
					});

	            	$('.open-popup').magnificPopup({
				      removalDelay: 500, //delay removal by X to allow out-animation
				      callbacks: {
				        beforeOpen: function() {
				           this.st.mainClass = this.st.el.attr('data-effect');
				           $('.fixed').css('left','-8.5px'); 
				        },
				        afterClose: function() {
				          $('.fixed').css('left','0px'); 
				        },
				      },
				      midClick: true
				    });

	            	// Инициализация модалки товара
				    $('.open-prod').magnificPopup({
				      removalDelay: 100, 
				      callbacks: {
				        beforeOpen: function() {
				           this.st.mainClass = this.st.el.attr('data-effect');
				           $('.fixed').css('left','-8.5px'); 
				        },
				        open: function() {
				        	let src = $('.mfp-content').find('.product-popup').attr('id');
				        	let videoSrc = this.st.el.attr('data-video');
				        	console.log(videoSrc);
				        	console.log(src);
				        	$('#'+src).find('iframe').attr('src', videoSrc)
				        	
				        	let info = $('.mfp-content').find('.product-popup').find('.product-popup_info-information').html();
				        	let img = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]').find('.image').html();
				        	$('.mdn .mdn-content .image').html(img);
				        	$('.mdn .mdn-content .content').html(info);
				        	$('.product-popup').find('img').each(function(){
				        		let src = $(this).attr('data-src');
				        		$(this).attr('src', src);
				        	});


				        	$('.mfp-wrap').scroll(function(){
				        		if ($(this).scrollTop() > 500) {
				        			$('.mdn').fadeIn();
				        		} else {
				        			$('.mdn').fadeOut();
				        		}
				        	});		        	
				        },
				        close: function() {
							$('.mdn').hide();
							$('.mdn .mdn-content .image').empty();
				        	$('.mdn .mdn-content .content').empty();
					  	},
				        afterClose: function() {
				          $('.fixed').css('left','0px'); 
				          
				        },
				      },
				      midClick: true
				    });

				    $('.catalog__grid-items_item').each(function(){
						let src = $(this).attr('data-mfp-src');
						let ind = $(this).find('.buy').attr('data-ind');
						let title = $(this).find('.caption').text();
						let category = $(this).find('.category').text();
						let elems = $(this).find('.texted').text();
						let price = $(this).find('.price').html();
						$(src).find('.product-popup_info-information_category').text(category);
						$(src).find('.product-popup_info-information_title').text(title);
						$(src).find('.product-popup_info-information_props .price').html(price);
						$(src).find('.product-popup_info-information_props .quantity .texted').text(elems);
						$(src).find('.product-popup_info-information_ordered').attr('data-ind', ind);
					});

	            	/*$('.product-popup_info-information_ordered').each(function(){
	            		//let fl = 0;
	            		let src = $(this).parents('.product-popup').attr('id');
			    		let $product = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]');

				    	$(this).click(function(e){
				    		e.preventDefault();
				    		e.stopPropagation();
				    		if ($product.find('.buys').hasClass('visible')) {
	            				fl = 1;
		            		} else {
		            			fl = 0;
		            		}	
					    	if (fl == 0) {
					    		$(this).find('.buys').addClass('visible');
					    		$('.fixed_menu-cart').addClass('mayopen');			    			
					    		let src = $(this).parents('.product-popup').attr('id');
					    		let $product = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]');
					    		$product.find('.buys').addClass('visible');
					    		let category = $product.find('.category').text();
					    		let caption = $product.find('.caption').text();
					    		let imageHref = $product.find('.image').find('img').attr('src');
					    		let quantity = $product.find('.quantity').html();
					    		let price = $product.find('.price').html();
					    		let index = $(this).attr('data-ind');
					    		$('.fixed_menu-cart').find('.products-content').append('<div class="product" data-ind="'+  index +'"><div class="image"><img src="'+ imageHref +'"></div><div class="text"><div class="category">'+ category +'</div><div class="caption">'+ caption +'</div></div><div class="elem-price"><div class="elems">'+ quantity +'</div><div class="price">'+ price +'</div></div><div class="delete"></div></div>');
					    		let amount = $('.product').length;
					    		$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

					    		$('.fixed_menu-cart .icon span').addClass('vis').text(amount);
					    		let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
				    			$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

				    			let priceValue = $product.find('.price').find('span:nth-child(1)').text();
				    			priceValue = priceValue.replace(/\s+/g, '');
				    			priceValue = Number(priceValue);
				    			summPrices += priceValue;


				    			if (summPrices >= 10000) {
				    				$('.offer').css('display','flex');
				    			} else {
				    				$('.offer').css('display','none');
				    			}

				    			let summ = String(summPrices);
				    			summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
				    			$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


					    		if ($('.product').length > 3) {   			
					    			$('.products-content').mCustomScrollbar();
					    		} else {
					    		}
					    		$('.products-content').mCustomScrollbar("destroy");
					    		$('.products-content').mCustomScrollbar();
					    			


					    		fl = 1;
					    	} else {
					    		let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
					    		$('#order-popup').find('.order-products').html(productsInCart);
					    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
					    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
					    		$('.order-popup_mainorder .price .summ').text(summ);
					    		summ = summ.replace(/\s+/g, '');
				    			summ = Number(summ);
				    			if (summ >= 10000) {
				    				$('.order-popup_mainorder .price .prim').show();
				    			} else {
				    				$('.order-popup_mainorder .price .prim').hide();
				    			}

					    		$('.order-popup_mainorder .quantity .qua').text(quantity);
					    		
					    		//$('.order-products').mCustomScrollbar();
					    		$.magnificPopup.open({
					                items: {
					                    src: '#order-popup',
					                    type: 'inline'
					              	},
					              	removalDelay: 500, //delay removal by X to allow out-animation
								    callbacks: {
								        beforeOpen: function() {
							           		this.st.mainClass = 'mfp-zoom-in'
							           		$('.fixed').css('left','-8.5px'); 
							           		//$('.order-products').mCustomScrollbar("update")
							           		$('.order-products').mCustomScrollbar();
								        },
								        afterClose: function() {
							          		$('.fixed').css('left','0px'); 
							          		$('.order-products').removeClass('opens');
							          		$('.order-products').mCustomScrollbar("destroy")
								        },
								      },
					                closeBtnInside: true
					            });
					    		fl = 0;
					    	}
				    	});
				    });*/


	            	$('.slider-for').slick({
					  slidesToShow: 1,
					  slidesToScroll: 1,
					  lazyLoad: 'ondemand',
					  fade: true,
					  arrows: false,
					  draggable: false,
					  asNavFor: '.slider-nav'
					});
					$('.slider-nav').slick({
					  slidesToShow: 5,
					  slidesToScroll: 1,
					  lazyLoad: 'ondemand',
					  draggable: false,
					  asNavFor: '.slider-for',
					  focusOnSelect: true
					});


					

	            	$('.product').each(function(){
	            		$('.buy[data-ind="'+ $(this).attr('data-ind') +'"]').find('.buys').addClass('visible');
	            		$('.product-popup_info-information_ordered[data-ind="'+ $(this).attr('data-ind') +'"]').find('.buys').addClass('visible');
	            	});

	            	limit = limit + 1;

	            	$('.catalog__grid-sort_gender .link span').text('Пол ребенка');
					$('.catalog__grid-sort_gender .dropdown a').removeClass('select');
					$('.catalog__grid-sort_form .link span').text('Форма кроватки');
					$('.catalog__grid-sort_form .dropdown a').removeClass('select');
					$('.catalog__grid-sort_season .link span').text('Сезон');
					$('.sort').removeClass('selected');
					$('.catalog__grid-sort_season .dropdown a').removeClass('select');


	            	function concatValues(obj) {
						var value = '';
						for ( var prop in obj ) {
							value += obj[ prop ];
						}
						return value;
					}

	            	


				    // Круглая кнопка покупки в карточке товара (2 состояния)
	            	$('.catalog__grid-items_item .buy').each(function(){
	            		let fl = 0;
	            		if ($(this).find('.buys').hasClass('visible')) {
	            			fl = 1;
	            		}
				    	$(this).click(function(e){
				    		e.preventDefault();
				    		e.stopPropagation();
				    		let src = $(this).parents('.catalog__grid-items_item').attr('data-mfp-src');
					    	if ($(src).find('.buys').hasClass('visible')) {
	            				fl = 1;
		            		} else {
		            			fl = 0;
		            		}	
					    	if (fl == 0) {
					    		$(this).find('.buys').addClass('visible');
					    		let src = $(this).parents('.catalog__grid-items_item').attr('data-mfp-src');
					    		console.log(src);
					    		let btnSrc = $(this).attr('data-ind');
					    		let btn = $('.mdn').find('a[data-ind="'+ btnSrc +'"]');
					    		btn.find('.buys').addClass('visible');
					    		btn.find('span').text('Оформить заказ');
					    		$(src).find('.product-popup_info-information_ordered').find('span').text('Оформить заказ');
					    		$(src).find('.buys').addClass('visible');
					    		$('.fixed_menu-cart').addClass('mayopen');
					    		let $product = $(this).parents('.catalog__grid-items_item');
					    		let category = $product.find('.category').text();
					    		let caption = $product.find('.caption').text();
					    		let imageHref = $product.find('.image').find('img').attr('src');
					    		let quantity = $product.find('.quantity').html();
					    		let price = $product.find('.price').html();
					    		let index = $(this).attr('data-ind');
					    		$('.fixed_menu-cart').find('.products-content').append('<div class="product" data-ind="'+  index +'"><div class="image"><img src="'+ imageHref +'"></div><div class="text"><div class="category">'+ category +'</div><div class="caption">'+ caption +'</div></div><div class="elem-price"><div class="elems">'+ quantity +'</div><div class="price">'+ price +'</div></div><div class="delete"></div></div>');
					    		let amount = $('.products-content').find('.product').length;
					    		$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

					    		$('.fixed_menu-cart .icon span').addClass('vis').text(amount);
					    		let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
				    			$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

				    			let priceValue = $product.find('.price').find('span:nth-child(1)').text();
				    			priceValue = priceValue.replace(/\s+/g, '');
				    			priceValue = Number(priceValue);
				    			summPrices += priceValue;


				    			if (summPrices >= 10000) {
				    				$('.offer').css('display','flex');
				    			} else {
				    				$('.offer').css('display','none');
				    			}

				    			let summ = String(summPrices);
				    			summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
				    			$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


					    		if ($('.product').length > 3) {   			
					    			$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
					    		} else {
					    		}
					    		$('.products-content').mCustomScrollbar("destroy");
					    		$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
					    			


					    		fl = 1;
					    	} else {
					    		let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
					    		$('#order-popup').find('.order-products').html(productsInCart);
					    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
					    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
					    		$('.order-popup_mainorder .price .summ').text(summ);
					    		summ = summ.replace(/\s+/g, '');
				    			summ = Number(summ);
				    			if (summ >= 10000) {
				    				$('.order-popup_mainorder .price .prim').show();
				    			} else {
				    				$('.order-popup_mainorder .price .prim').hide();
				    			}

					    		$('.order-popup_mainorder .quantity .qua').text(quantity);
					    		
					    		$.magnificPopup.open({
					                items: {
					                    src: '#order-popup',
					                    type: 'inline'
					              	},
					              	removalDelay: 500, 
								    callbacks: {
								        beforeOpen: function() {
							           		this.st.mainClass = 'mfp-zoom-in'
							           		$('.fixed').css('left','-8.5px'); 
							           		$('.order-products').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
								        },
								        afterClose: function() {
							          		$('.fixed').css('left','0px'); 
							          		$('.order-products').removeClass('opens');
							          		$('.order-products').mCustomScrollbar("destroy")
								        },
								      },
					                closeBtnInside: true
					            });
					    		fl = 0;
					    	}
				    	});
				    });

					// Клик по кнопке "добавить в корзину" внутри модалки товара (2 состояния)
				    $('.product-popup_info-information_ordered').each(function(){
	            		//let fl = 0;
	            		let src = $(this).parents('.product-popup').attr('id');
			    		let $product = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]');
				    	$(this).click(function(e){
				    		e.preventDefault();
				    		e.stopPropagation();
				    		console.log('asd')
				    		if ($product.find('.buys').hasClass('visible')) {
	            				fl = 1;
		            		} else {
		            			fl = 0;
		            		}	
					    	if (fl == 0) {
					    		let lineSrc = $(this).attr('data-ind');
			    				let lineBtn = $('.mdn').find('a[data-ind="'+ lineSrc +'"]');
			    				$(lineBtn).find('.buys').addClass('visible');
			    				$(lineBtn).find('span').text('Оформить заказ');
					    		$(this).find('.buys').addClass('visible');
					    		$(this).find('span').text('Оформить заказ');
					    		$('.fixed_menu-cart').addClass('mayopen');			    			
					    		let src = $(this).parents('.product-popup').attr('id');
					    		let $product = $('.catalog__grid-items_item[data-mfp-src="#'+ src +'"]');
					    		$product.find('.buys').addClass('visible');
					    		let category = $product.find('.category').text();
					    		let caption = $product.find('.caption').text();
					    		let imageHref = $product.find('.image').find('img').attr('src');
					    		let quantity = $product.find('.quantity').html();
					    		let price = $product.find('.price').html();
					    		let index = $(this).attr('data-ind');
					    		$('.fixed_menu-cart').find('.products-content').append('<div class="product" data-ind="'+  index +'"><div class="image"><img src="'+ imageHref +'"></div><div class="text"><div class="category">'+ category +'</div><div class="caption">'+ caption +'</div></div><div class="elem-price"><div class="elems">'+ quantity +'</div><div class="price">'+ price +'</div></div><div class="delete"></div></div>');
					    		let amount = $('.product').length;
					    		$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

					    		$('.fixed_menu-cart .icon span').addClass('vis').text(amount);
					    		let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
				    			$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

				    			let priceValue = $product.find('.price').find('span:nth-child(1)').text();
				    			priceValue = priceValue.replace(/\s+/g, '');
				    			priceValue = Number(priceValue);
				    			summPrices += priceValue;


				    			if (summPrices >= 10000) {
				    				$('.offer').css('display','flex');
				    			} else {
				    				$('.offer').css('display','none');
				    			}

				    			let summ = String(summPrices);
				    			summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
				    			$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


					    		if ($('.product').length > 3) {   			
					    			$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
					    		} else {
					    		}
					    		$('.products-content').mCustomScrollbar("destroy");
					    		$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
					    			


					    		fl = 1;
					    	} else {
					    		let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
					    		$('#order-popup').find('.order-products').html(productsInCart);
					    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
					    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
					    		$('.order-popup_mainorder .price .summ').text(summ);
					    		summ = summ.replace(/\s+/g, '');
				    			summ = Number(summ);
				    			if (summ >= 10000) {
				    				$('.order-popup_mainorder .price .prim').show();
				    			} else {
				    				$('.order-popup_mainorder .price .prim').hide();
				    			}

					    		$('.order-popup_mainorder .quantity .qua').text(quantity);
					    		
					    		//$('.order-products').mCustomScrollbar();
					    		$.magnificPopup.open({
					                items: {
					                    src: '#order-popup',
					                    type: 'inline'
					              	},
					              	removalDelay: 500, //delay removal by X to allow out-animation
								    callbacks: {
								        beforeOpen: function() {
							           		this.st.mainClass = 'mfp-zoom-in'
							           		$('.fixed').css('left','-8.5px'); 
							           		//$('.order-products').mCustomScrollbar("update")
							           		$('.order-products').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
								        },
								        afterClose: function() {
							          		$('.fixed').css('left','0px'); 
							          		$('.order-products').removeClass('opens');
							          		$('.order-products').mCustomScrollbar("destroy")
								        },
								      },
					                closeBtnInside: true
					            });
					    		fl = 0;
					    	}
				    	});
				    });

					// Клик по кнопке "добавить в корзину" внутри ездящей полоски
			    	$('body').on('click','.mdn .mdn-content .content a',function(e){
			    		let src = $(this).attr('data-ind');
		    			let $product = $('.buy[data-ind="'+ src +'"]').parents('.catalog__grid-items_item');
		    			console.log($product)
		    			let $prodBtn = $('.product-popup').find('[data-ind="'+ src +'"]');
		    			console.log('asdaa')
			    		e.preventDefault();
			    		e.stopPropagation();
	            		console.log(fl)
	            		fl = 0;
				    	if (fl == 0) {
				    		$(this).find('.buys').addClass('visible');
				    		$(this).find('span').text('Оформить заказ');
				    		$('.fixed_menu-cart').addClass('mayopen');			    			
				    		$product.find('.buys').addClass('visible');
				    		$prodBtn.find('.buys').addClass('visible');
				    		$prodBtn.find('span').text('Оформить заказ');
				    		let category = $product.find('.category').text();
				    		let caption = $product.find('.caption').text();
				    		let imageHref = $product.find('.image').find('img').attr('src');
				    		let quantity = $product.find('.quantity').html();
				    		let price = $product.find('.price').html();
				    		let index = $(this).attr('data-ind');
				    		$('.fixed_menu-cart').find('.products-content').append('<div class="product" data-ind="'+  index +'"><div class="image"><img src="'+ imageHref +'"></div><div class="text"><div class="category">'+ category +'</div><div class="caption">'+ caption +'</div></div><div class="elem-price"><div class="elems">'+ quantity +'</div><div class="price">'+ price +'</div></div><div class="delete"></div></div>');
				    		let amount = $('.product').length;
				    		$('.fixed_menu-cart_dropdown .order-price .number').text(amount);

				    		$('.fixed_menu-cart .icon span').addClass('vis').text(amount);
				    		let tovars = declOfNum(amount, ['товар', 'товара', 'товаров']);
			    			$('.fixed_menu-cart_dropdown .order-price .tovars').text(tovars);

			    			let priceValue = $product.find('.price').find('span:nth-child(1)').text();
			    			priceValue = priceValue.replace(/\s+/g, '');
			    			priceValue = Number(priceValue);
			    			summPrices += priceValue;


			    			if (summPrices >= 10000) {
			    				$('.offer').css('display','flex');
			    			} else {
			    				$('.offer').css('display','none');
			    			}

			    			let summ = String(summPrices);
			    			summ = summ.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
			    			$('.fixed_menu-cart_dropdown .order-price .total-price span:nth-child(1)').text(summ);


				    		if ($('.product').length > 3) {   			
				    			$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
				    		} else {
				    		}
				    		$('.products-content').mCustomScrollbar("destroy");
				    		$('.products-content').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
				    			


				    		fl = 1;
				    	} else {
				    		let productsInCart = $('.fixed_menu-cart_dropdown').find('.products-content').mCustomScrollbar("destroy").html();
				    		$('#order-popup').find('.order-products').html(productsInCart);
				    		let quantity = $('.fixed_menu-cart_dropdown .order-price .product-price .qua .text .number').text();
				    		let summ = $('.fixed_menu-cart_dropdown .order-price .product-price .total-price span:first-child').text();
				    		$('.order-popup_mainorder .price .summ').text(summ);
				    		summ = summ.replace(/\s+/g, '');
			    			summ = Number(summ);
			    			if (summ >= 10000) {
			    				$('.order-popup_mainorder .price .prim').show();
			    			} else {
			    				$('.order-popup_mainorder .price .prim').hide();
			    			}

				    		$('.order-popup_mainorder .quantity .qua').text(quantity);
				    		
				    		//$('.order-products').mCustomScrollbar();
				    		$.magnificPopup.open({
				                items: {
				                    src: '#order-popup',
				                    type: 'inline'
				              	},
				              	removalDelay: 500, //delay removal by X to allow out-animation
							    callbacks: {
							        beforeOpen: function() {
						           		this.st.mainClass = 'mfp-zoom-in'
						           		$('.fixed').css('left','-8.5px'); 
						           		//$('.order-products').mCustomScrollbar("update")
						           		$('.order-products').mCustomScrollbar({mouseWheelPixels: 700, scrollInertia: 100});
							        },
							        afterClose: function() {
						          		$('.fixed').css('left','0px'); 
						          		$('.order-products').removeClass('opens');
						          		$('.order-products').mCustomScrollbar("destroy")
							        },
							      },
				                closeBtnInside: true
				            });
				    		fl = 0;
				    	}
			    	});


					$(".order-form").validate({
					    errorPlacement: function(error,element) {
					        return true;
					    },
					    focusInvalid: false,
					    rules: {
					      name: {
					        required: true,
					        minlength: 2,
					        maxlength: 32
					      },
					      tel: {
					        required: true,
					        minlength: 10
					      },
					      email: {
					      	required: true,
					      	email: true
					      }
					    },
					    submitHandler: function(form) {
					        var formData = new FormData();
							let count = 0;
							let arr = [];
							let name = $(form).find('.name-input').val();
							let tel = $(form).find('.tel-input').val();
							let mail = $(form).find('.mail-input').val();
							let rubl = $('.catalog__grid-items_item:first-child .props-buy .props .price .rubl').text();
							let qua = $(form).find('.order-popup_mainorder').find('.quantity').find('span.qua').text() + ' шт.';
							let summ = $(form).find('.order-popup_mainorder').find('.price').find('span.summ').text() + ' ' + rubl;
						        $('.order-products .product').each(function(){
									count++;
									let obj = {};
									let th = $(this);
									let category = th.find('.category').text();
									let title = th.find('.caption').text();
									let elems = th.find('.texted').find('span').text();
									let price = th.find('.price').find('span:first-child').text();
									obj.title = title;
									obj.category = category;
									obj.elems = elems;
									obj.price = price;
									arr.push(obj);
								});
								formData.append('Товары', JSON.stringify(arr));
								formData.append('Количество', qua);
								formData.append('Сумма', summ);
								formData.append('Имя', name);
								formData.append('Телефон', tel);
								formData.append('Email', mail);
							$.ajax ({
								url: 'send.php',
								data: formData, 
								type: 'POST', 
								processData: false,
								contentType: false,
								success: function(data){
									$.magnificPopup.open({
						                items: {
						                    src: '#thanks-popup',
						                    type: 'inline'
						              	},
						              	removalDelay: 500, 
									    callbacks: {
									        beforeOpen: function() {
								           		this.st.mainClass = 'mfp-zoom-in'
								           		$('.fixed').css('left','-8.5px'); 
								           		//$('.order-products').mCustomScrollbar();
									        },
									        afterClose: function() {
								          		$('.fixed').css('left','0px'); 
								          		//$('.order-products').removeClass('opens');
								          		$//('.order-products').mCustomScrollbar("destroy")
									        },
									      },
						                closeBtnInside: true
						            });
								}, error: function(jqXHR, textStatus, errorThrown){
		                        	alert('Error: '+ errorThrown);
		                    	}	
							});
					        return false;
					    }
					  });
					
					$(".fast-form").each(function(){
						$(this).validate({
						    errorPlacement: function(error,element) {
						        return true;
						    },
						    focusInvalid: false,
						    rules: {
						      name: {
						        required: true,
						        minlength: 2,
						        maxlength: 32
						      },
						      tel: {
						        required: true,
						        minlength: 10
						      },
						      email: {
						      	required: true,
						      	email: true
						      }
						    },
						    submitHandler: function(form) {
						        var formData1 = new FormData();
								let count = 0;
								let arr = [];
								let name = $(form).find('.name-input').val();
								let tel = $(form).find('.tel-input').val();
								let mail = $(form).find('.mail-input').val();
								//let rubl = $('.catalog__grid-items_item:first-child .props-buy .props .price .rubl').text();
								//let qua = $(form).find('.order-popup_mainorder').find('.quantity').find('span.qua').text() + ' шт.';
								//let summ = $(form).find('.order-popup_mainorder').find('.price').find('span.summ').text() + ' ' + rubl;
									count++;
									let obj = {};
									let th = $(form).parents('.product-popup_info-information');
									let category = th.find('.product-popup_info-information_category').text();
									console.log(category)
									let title = th.find('.product-popup_info-information_title').text();
									let elems = th.find('.product-popup_info-information_props .quantity .texted').text();
									let price = th.find('.product-popup_info-information_props .price').find('span:first-child').text();
									obj.title = title;
									obj.category = category;
									obj.elems = elems;
									obj.price = price;
									arr.push(obj);
									formData1.append('Товары', JSON.stringify(arr));
									//formData.append('Количество', qua);
									//formData.append('Сумма', summ);
									formData1.append('Имя', name);
									formData1.append('Телефон', tel);
									formData1.append('Email', mail);
								$.ajax ({
									url: 'send.php',
									data: formData1, 
									type: 'POST', 
									processData: false,
									contentType: false,
									success: function(data){
										$.magnificPopup.open({
							                items: {
							                    src: '#thanks-popup',
							                    type: 'inline'
							              	},
							              	removalDelay: 500, 
										    callbacks: {
										        beforeOpen: function() {
									           		this.st.mainClass = 'mfp-zoom-in'
									           		$('.fixed').css('left','-8.5px'); 
									           		//$('.order-products').mCustomScrollbar();
										        },
										        afterClose: function() {
									          		$('.fixed').css('left','0px'); 
									          		//$('.order-products').removeClass('opens');
									          		$//('.order-products').mCustomScrollbar("destroy")
										        },
										      },
							                closeBtnInside: true
							            });
									}, error: function(jqXHR, textStatus, errorThrown){
			                        	alert('Error: '+ errorThrown);
			                    	}	
								});
						        return false;
						    }
					  	});
					});

					

				    function declOfNum(number, titles) {  
					    var cases = [2, 0, 1, 1, 1, 2];  
					    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
					}

					let $grid = $('.catalog__grid-items'),
					$item = $('.catalog__grid-items_item')
					filterButtons = $('.catalog__grid-sort'),
					showMore = $('.catalog__grid-more'),
					filters = {},
					filterValue = '',
					filtered = '';


					function hideElementToLimit() {
						$($item).hide();
						for (let i = 0; i < $item.length; i++) {
							if (i <= limit-1) {
								$($item[i]).show();
								showMore.css('opacity', '0');
							} else {
								showMore.css('opacity', '1');
							}
						}
					}

					function firstSort() {
						$item.sortElements(function(a, b){
							return parseInt($(a).find('.price').find('span:first-child').text().replace(/\s/g, '')) > parseInt($(b).find('.price').find('span:first-child').text().replace(/\s/g, '')) ? 1 : -1;
						});
					}

					firstSort();
					hideElementToLimit();
					


					$('.button-group').each( function(i, buttonGroup) {
						var $buttonGroup = $( buttonGroup );
						$buttonGroup.on('click', '.button', function(event) {
							$buttonGroup.find('.select').removeClass('select');
							var $button = $(event.currentTarget);
							$button.addClass('select');
						});
					});

					// Фильтрация (пол, форма, сезон)
					filterButtons.on('click','.button', function(e){
						e.preventDefault();
						$grid.fadeOut('fast');
						let $button = $(e.currentTarget);
						let $buttonGroup = $button.parents('.button-group');
						let filterGroup = $buttonGroup.attr('data-filter-group');
						filters[filterGroup] = $button.attr('data-filter');
						filterValue = concatValues(filters);
						filtered = $item.filter(filterValue);
						let length = filtered.length;
						$item.hide();
						limit = getLimit;
						limit = limit - 1;
						if (length == 0) {
							$('.catalog__grid-zero').css('display','flex');
							showMore.css('opacity', '0');
						} else {
							$('.catalog__grid-zero').css('display','none');
							//showMore.css('opacity', '0');
						}
						for (let i = 0; i < length; i++) {
							if (i <= limit) {
								$(filtered[i]).show();
								showMore.css('opacity', '0');
							} else {
								showMore.css('opacity', '1');
							}
						}
						$grid.fadeIn('slow');	
					});

					// Сортировка
					$('[data-option]').click(function(e){
						e.preventDefault();
						$grid.fadeOut('fast');
						$('[data-option]').removeClass('select');
						$(this).addClass('select');
						let type = $(this).attr('data-sorttype');
					    let option = $(this).attr('data-option');
					    if (option == 'price') {
					    	if (type == 'ass') {
					    		$item.sortElements(function(a, b){
									return parseInt($(a).find('.price').find('span:first-child').text().replace(/\s/g, '')) > parseInt($(b).find('.price').find('span:first-child').text().replace(/\s/g, '')) ? 1 : -1;
								});
						    } else {
						    	$item.sortElements(function(a, b){
									return parseInt($(a).find('.price').find('span:first-child').text().replace(/\s/g, '')) < parseInt($(b).find('.price').find('span:first-child').text().replace(/\s/g, '')) ? 1 : -1;
								});
						    }
					    } else {
					    	$item.sortElements(function(a, b){
								return parseInt($(a).find('.texted').find('span').text().replace(/\s/g, '')) > parseInt($(b).find('.texted').find('span').text().replace(/\s/g, '')) ? 1 : -1;
							});
					    }    
					    $grid.fadeIn('slow');
					});

					// Кнопка показать еще
					$('.catalog__grid-more .more').click(function(e){
						e.preventDefault();
						if (jQuery.isEmptyObject(filters) == true) {
							limit = limit + limit;
							hideElementToLimit();
						} else {
							filtered = $item.filter(filterValue);
							let length = filtered.length;
							$item.hide();
							limit = getLimit;
							limit = limit + limit;
							limit = limit - 1;
							for (let i = 0; i < length; i++) {
								if (i <= limit) {
									$(filtered[i]).show();
									showMore.css('opacity', '0');
								} else {
									showMore.css('opacity', '1');
								}
							}
						}
					});
					
					// Сортировка по кол-ву
					$('.catalog__grid-actions_quantity .dropdown a').click(function(e){
						e.preventDefault();
						$('.catalog__grid-actions_quantity .dropdown a').removeClass('select');
						$(this).addClass('select');
						getLimit = $(this).attr('data-filter');
						if (jQuery.isEmptyObject(filters) == true) {
							$grid.fadeOut('fast');
							limit = getLimit;
							hideElementToLimit();
							$grid.fadeIn('slow');
						} else {
							$grid.fadeOut('fast');
							filtered = $item.filter(filterValue);
							let length = filtered.length;
							$item.hide();
							limit = getLimit;
							limit = limit - 1;
							for (let i = 0; i < length; i++) {
								if (i <= limit) {
									$(filtered[i]).show();
									showMore.css('opacity', '0');
								} else {
									showMore.css('opacity', '1');
								}
							}
							$grid.fadeIn('slow');
						}
					});

					$('.catalog__grid-actions_reset').on('click', function(e){
						e.preventDefault();
						$grid.fadeOut('fast');
						$('.catalog__grid-sort_gender .link span').text('Пол ребенка');
						$('.catalog__grid-sort_gender .dropdown a').removeClass('select');
						$('.catalog__grid-sort_form .link span').text('Форма кроватки');
						$('.catalog__grid-sort_form .dropdown a').removeClass('select');
						$('.catalog__grid-sort_season .link span').text('Сезон');
						$('.sort').removeClass('selected');
						$('.catalog__grid-sort_season .dropdown a').removeClass('select');
						//limit = limit + 1;
						$('.catalog__grid-zero').css('display','none');
						hideElementToLimit();
						filters = {};
						$grid.fadeIn('slow');	
					});

	            	
	            },100);
	            

	        })
	    }
	    function loadingModal(){
	        $('#hidden').load(hreff, '', function(){
	            $('#hidden').fadeTo(0, 1);
	        })
	    }
	    //loading();
	    //loadingModal();
	    return false;
	});

	// Показ/скрытие определенной картинки при наведении на текст в первом экране
	$('h1 span').mouseenter(function(){
		let href = $(this).attr('data-image');
		$(href).addClass('visible');
	});

	$('h1 span').mouseleave(function(){
		let href = $(this).attr('data-image');
		$(href).removeClass('visible');
	});

	// lazy load
	$(function() {
		$('.lazy').lazy();
	});

	// 0. random number
	function getRandom(min, max) {
		var index = parseInt(Math.random() * (max - min + 1)) + min;
		if (index != lastIndex) {
			lastIndex = index;
			return index;
		} else {
			getRandom(min, max);
		}
	}
	// 1. define all images list
	var unusedImages = []; // all images list. We get it from html block
	// 2. define used images array
	var usedImages = []; // used images array
	var nowShows = []; // images displayed now
	// 3. define images index max
	var maxIndex = 31;
	// 4. function to change random images in interval

	// last index to remove repeat
	var lastIndex = 0;

	var timer = setInterval(randomImagesChange, 4 * 1000);
	var indexMain = 0;

	function randomImagesChange() {
			// get random index for line change
			var lineIndex = getRandom(1, maxIndex);
			// TODO: remove old image from show now
			nowShows.splice(nowShows.indexOf($('.grid-item[data-index='+ lineIndex +']').find('img').attr('src')), 1);
			// get random image from unused
			var unusedIndex = Math.floor(Math.random() * unusedImages.length);
			var unusedSrc = unusedImages[unusedIndex];
			// add src to shows now
			nowShows.push(unusedSrc);
			// change image
			$('.grid-item[data-index='+ lineIndex +']').find('img').fadeOut();
			setTimeout(function(){
				$('.grid-item[data-index='+ lineIndex +']').find('img').attr('src', unusedSrc);
			},600);
			setTimeout(function () {
				$('.grid-item[data-index='+ lineIndex +']').find('img').fadeIn();
			}, 1* 1000);
			
			// remove image from unused 
			unusedImages.splice(unusedIndex, 1);
			// and add it to used
			usedImages.push(unusedSrc);
			// check usused images length
			console.log('change image ' + unusedSrc + ' on line-index ' + lineIndex);

			if (unusedImages.length < 1) {
				clearInterval(timer);
				recalculateArrays();
			}
	}
	// 6. recalculate used images
	// 7. recalculate new arrays
	function recalculateArrays() {
		// exclude from used images now shows
		nowShows.forEach(function (item) {
			var indexUsed = usedImages.indexOf(item);
			if (indexUsed != -1) {
				// write it to unused
				unusedImages.push(item);
				usedImages.slice(indexUsed, 1);
			}
		});
		timer = setInterval(randomImagesChange, 4 * 1000)
	}
	// 8. fill unused images
	function fillImages() {
		// fill used images array
		$('.header__photos-grid').find('img').each(function (index) {
			var imgSrc = $(this).attr('src');
			usedImages.push(imgSrc);
		})
		// get all images array
		$('.header_photos_initial').find('img').each(function (index) {
			var imgSrc = $(this).attr('data-src');
			if (unusedImages.indexOf(imgSrc) === -1 && usedImages.indexOf(imgSrc) === -1) {
				unusedImages.push(imgSrc);
			}
		});	
	}

	$(document).ready(function () {
		fillImages();
		randomImagesChange();
	});
	


	// Рандомная картинка в рандомном блоке на 1 экране (каждые 5 секунд)
	// var usedImages = [];
	// setInterval(function(){

	// Полоса с фотками
	/*$("#scroller").simplyScroll({
		manualMode: 'loop',
		frameRate: 1000,
		speed: .5,
		pauseOnHover: false
	});*/

 	// Скролл по якорям
 	$('.scrolled').click(function(event){
        event.preventDefault();
        var id = $(this).attr('href'),
        top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 350);
  	});

 	// Подгрузка видео
 	setTimeout(function(){
 		$('.videos').each(function () {
			var video = $(this);
			var src = video.attr('src');
			if (src=='#') {
				video.attr('src',video.attr('data-src'));
			}
		});
 	},200);
 	

 	// Подгрузка картинок в линию
	$('.image-lines').each(function () {
		var img = $(this);
		var src = img.attr('src');
		if (src == '#') {
			img.attr('src',img.attr('data-src'));
		}
	});

	// Запуск/пауза видео
 	$('.why__content-block .video .video-content a').click(function (e) {
 		e.preventDefault();
 		$(this).find('.image').toggleClass('fade');
		var video = $(this).parents('.video-content').find('video');
		var src = video.attr('src');
		if (video.get(0).paused) {
			video.get(0).play();
		} else {
			video.get(0).pause();
		}
	});

	// Слайдер для "интересное"
 	var swiper = new Swiper('.swiper-container', {
 		slidesPerView: 1,
 		effect: 'fade',
 		loop: true,
 		speed: 1000,
	 	preloadImages: false,
    	lazy: true,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
    });

 	// Добавление кнопки "еще"
    setTimeout(function(){
    	$('.swiper-button-next').append('ещё  <span>›</span>');
    },50);

    
    // Подстановка слов в зависимости от числа (1 товар, 2 товара, 5 товаров)
    function declOfNum(number, titles) {  
	    var cases = [2, 0, 1, 1, 1, 2];  
	    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	}


    
});
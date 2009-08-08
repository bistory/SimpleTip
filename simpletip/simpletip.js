var SimpleTip = {
	showEffect: Effect.Appear,
	hideEffect: Effect.Fade,
	xOffset: 6,
	yOffset: 25,
	affiche: false,
	
	start: function() {
		SimpleTip.bulle = new Element('div', {id: 'infobulle', 'class': 'fg-tooltip fg-tooltip-left'})
		.update('<div class="tooltip-content"></div><div class="fg-tooltip-pointer-down"><div class="fg-tooltip-pointer-down-inner"></div></div>');
			
		SimpleTip.descendants = SimpleTip.bulle.descendants();
			
		Event.observe(document, 'dom:loaded', function() {
			document.body.appendChild(SimpleTip.bulle);
			document.observe('mousemove', SimpleTip._moveTip);
			/*$('inheader').showTip('Machin', {hPos: 'left'});
			document.body.observe('click', SimpleTip.hideAllTips);*/
		});
	},

	hideAllTips: function() {
		if(SimpleTip.hideEffect)
		{
			$$('.duplicatedtip').each(SimpleTip.hideEffect);
		}
	},
	
	_moveTip: function(event) {
		if(SimpleTip.affiche) {
			SimpleTip.bulle._setTipPosition(Event.pointerX(event), Event.pointerY(event));
		}
	},
	
	_showTip: function(text) {
		SimpleTip.bulle.firstChild.update(text);
		SimpleTip.affiche = true;
	},
	
	_hideTip: function() {
		SimpleTip.affiche = false;
		SimpleTip.bulle.style.visibility = 'hidden';
	}
};

var Tips = {
	setTip: function(element, text) {
		element = $(element);
		element.observe('mouseenter', function() {
			SimpleTip._showTip(text);
		});
		
		element.observe('mouseleave', SimpleTip._hideTip);
	},

	hideTip: function(element) {
		element = $(element);
		new SimpleTip.hideEffect(element.tooltip);
		return element;
	},

	showTip: function(element, text, options) {
		element = $(element);
		if (typeof options == 'undefined') {
			options = {};
		}
		if(typeof element.tooltip == 'undefined') {
			element.tooltip = SimpleTip.bulle.cloneNode(true);
			
			var position = element.viewportOffset();
			
			with(element.tooltip) {
				id = null;
				hide();
				addClassName('duplicatedtip');
				firstChild.update(text);
				
				observe('click', function(){
					element.hideTip()
				});
			};
			
			document.body.appendChild(element.tooltip);
			element.tooltip._setTipPosition(position[0], position[1], options);
		}
		new SimpleTip.showEffect(element.tooltip);
		
		return element;
	},
	
	_setTipPosition: function(element, curX, curY, options) {
		element = $(element);
		
		if (typeof options == 'undefined') {
			options = {};
		}
		if (typeof options.vPos == 'undefined') {
			options.vPos = false;
		}
		if (typeof options.hPos == 'undefined') {
			options.hPos = false;
		}
		
		var descendants = element.descendants();
		
		var style = {
			visibility: 'visible'
		};
		
		var winsize = document.viewport.getDimensions();
		
		var rightedge = winsize.width - curX - SimpleTip.xOffset;
		var bottomedge = winsize.height - curY - SimpleTip.yOffset;
		
		var leftedge = (SimpleTip.xOffset < 0) ? SimpleTip.xOffset*(-1) : -1000;
		
		if(element.offsetWidth > winsize.width / 3) {
			style.width = winsize.width / 3;
		}
		
		// Horizontal
		if((rightedge < curX || options.hPos == 'left') && options.hPos != 'right') {
			// Left from the position
			style.left = curX - element.getWidth() + 'px';
			
			element.removeClassName('fg-tooltip-left').addClassName('fg-tooltip-right');
		} else {
			// Right from the position
			if(curX < leftedge) {
				style.left = '5px';
			} else {
				style.left = curX + SimpleTip.xOffset + 'px';
			}
			
			element.removeClassName('fg-tooltip-right').addClassName('fg-tooltip-left');
		}
		
		// Vertical
		if((bottomedge < element.offsetHeight || options.vPos == 'top') && options.vPos != 'bottom') {
			// Top from the position
			style.top = curY - element.getHeight() - SimpleTip.yOffset + 'px';
			
			descendants[1].className = 'fg-tooltip-pointer-down';
			descendants[2].className = 'fg-tooltip-pointer-down-inner';
		} else {
			// Bottom from the position
			style.top = curY + SimpleTip.yOffset + 'px';
			
			descendants[1].className = 'fg-tooltip-pointer-up';
			descendants[2].className = 'fg-tooltip-pointer-up-inner';
		}
		
		element.setStyle(style);
		
		return element;
	}
};
Element.addMethods(Tips);

SimpleTip.start();

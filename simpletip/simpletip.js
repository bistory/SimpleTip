var SimpleTip = {
	showEffect: Effect.Appear,
	hideEffect: Effect.Fade,
	xOffset: 6,
	yOffset: 25,
	affiche: false,
	
	start: function () {
		SimpleTip.bulle = new Element('div', {id: 'infobulle', 'class': 'fg-tooltip fg-tooltip-left'}).insert(
				new Element('div', {'class': 'tooltip-content'})
			)
			.insert(
				new Element('div', {'class': 'fg-tooltip-pointer-down'}).insert(
					new Element('div', {'class': 'fg-tooltip-pointer-down-inner'})
				)
			);
		SimpleTip.descendants = SimpleTip.bulle.descendants();
			
		Event.observe(document, 'dom:loaded', function () {
			$$('body')[0].insert(SimpleTip.bulle);
			document.observe('mousemove', SimpleTip._moveTip);
			/*$('inheader').showTip('Machin');
			$$('body')[0].observe('click', SimpleTip.hideAllTips);*/
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
	
	_showTip: function (text) {
		SimpleTip.descendants[0].update(text);
		SimpleTip.affiche = true;
	},
	
	_hideTip: function () {
		SimpleTip.affiche = false;
		SimpleTip.bulle.setStyle({visibility: 'hidden'});
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

	showTip: function(element, text) {
		element = $(element);
		if (typeof element.tooltip == 'undefined') {
			element.tooltip = SimpleTip.bulle.cloneNode(true);
			
			var position = element.viewportOffset();
			
			with (element.tooltip) {
				id = null;
				hide();
				addClassName('duplicatedtip');
				descendants()[0].update(text);
				
				_setTipPosition(position[0], position[1]);
				observe('click', element.hideTip);
			};
			
			$$('body')[0].insert(element.tooltip);
		}
		new SimpleTip.showEffect(element.tooltip);
		
		return element;
	},
	
	_setTipPosition: function (element, curX, curY) {
		element = $(element);
		
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
		if(rightedge < curX) {
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
		if(bottomedge < element.offsetHeight) {
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

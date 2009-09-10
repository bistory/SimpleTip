var SimpleTip = Class.create({
	initialize: function() {
		this.bulle = new Element('div', {'class': 'fg-tooltip fg-tooltip-left'})
		.update('<div class="tooltip-content"></div><div class="fg-tooltip-pointer-down"><div class="fg-tooltip-pointer-down-inner"></div></div>');
		
		this.descendants = this.bulle.descendants();
		this.shown = false;
		this.xOffset = 6;
		this.yOffset = 25;
		this.showEffect = Effect.Appear;
		this.hideEffect = Effect.Fade;
	},
	
	listen: function() {
		this.bulle.style.zIndex = 6001;
		document.observe('dom:loaded', function() {
			this.bulle.id = 'infobulle';
			document.body.appendChild(this.bulle);
			document.observe('mousemove', function(event) {
				if(this.shown) this.setPosition(event.pointerX(), event.pointerY());
			}.bindAsEventListener(this));
		}.bindAsEventListener(this));
	},
	
	show: function(text) {
		this.descendants[0].update(text);
		this.shown = true;
		this.getPosition();
	},
	
	hide: function() {
		this.shown = false;
		this.bulle.style.visibility = 'hidden';
		$$('.tooltipped').each(function (e) {
			e.tooltip.setOpacity(1);
		});
	},
	
	opacity: function() {
		this.getPosition();
		$$('.tooltipped').each(function (e) {
			var pos = e.tooltip.bulle.pos;
			if( !(this.bulle.pos.left > pos.right || this.bulle.pos.right < pos.left || this.bulle.pos.top > pos.bottom || this.bulle.pos.bottom < pos.top) )
				e.tooltip.setOpacity(.5);
			else
				e.tooltip.setOpacity(1);
		}, this);
	},
	
	setOpacity: function (t) {
		var op = this.bulle.getStyle('opacity');
		if(((t == 1 && op < 1) || (t == .5 && op > .5)) && this.effect.options.to != t) {
			this.effect.cancel();
			this.effect = new Effect.Fade(this.bulle, {from: op, to: t, duration: .2});
		}
	},
	
	setPosition: function(curX, curY, options) {
		if (typeof options == 'undefined')
			options = {};
		if (typeof options.vPos == 'undefined')
			options.vPos = false;
		if (typeof options.hPos == 'undefined')
			options.hPos = false;
		
		var style = {visibility: 'visible'},
			winsize = document.viewport.getDimensions(),
			rightedge = winsize.width - curX - this.xOffset,
			bottomedge = winsize.height - curY - this.yOffset,
			leftedge = (this.xOffset < 0) ? this.xOffset*(-1) : -1000;
		
		if(this.bulle.offsetWidth > winsize.width / 3)
			style.width = winsize.width / 3;
		
		// Horizontal
		if((rightedge < curX || options.hPos == 'left') && options.hPos != 'right') {
			// Left from the position
			style.left = curX - this.bulle.getWidth() + this.xOffset + 'px';
			
			this.bulle.removeClassName('fg-tooltip-left').addClassName('fg-tooltip-right');
		} else {
			// Right from the position
			if(curX < leftedge) {
				style.left = '5px';
			} else {
				style.left = curX + this.xOffset + 'px';
			}
			
			this.bulle.removeClassName('fg-tooltip-right').addClassName('fg-tooltip-left');
		}
		
		// Vertical
		if((bottomedge < this.bulle.offsetHeight || options.vPos == 'top') && options.vPos != 'bottom') {
			// Top from the position
			style.top = curY - this.bulle.getHeight() + 'px';
			
			this.descendants[1].className = 'fg-tooltip-pointer-down';
			this.descendants[2].className = 'fg-tooltip-pointer-down-inner';
		} else {
			// Bottom from the position
			style.top = curY + this.yOffset + 'px';
			
			this.descendants[1].className = 'fg-tooltip-pointer-up';
			this.descendants[2].className = 'fg-tooltip-pointer-up-inner';
		}
		
		this.bulle.setStyle(style);
		
		if(!this.bulle.hasClassName('statictip'))
		{
			this.opacity();
		}
	},
	
	getPosition: function () {
		var size = this.bulle.getDimensions(),
			p = this.bulle.positionedOffset();
		this.bulle.pos = {
			left: p.left,
			right: p.left + size.width,
			top: p.top,
			bottom: p.top + size.height
		}
	}
});

var Tips = {
	setTip: function(element, text) {
		$(element).observe('mouseenter', function() { sTip.show(text); })
				  .observe('mouseleave', sTip.hide.bind(sTip));
	},

	hideTip: function(element) {
		element = $(element);
		new sTip.hideEffect(element.tooltip.bulle);
		return element;
	},

	showTip: function(element, text, options) {
		element = $(element);
		if(typeof element.tooltip == 'undefined') {
			element.tooltip = new SimpleTip();
			
			element.addClassName('tooltipped');
			element.tooltip.bulle.hide()
				.addClassName('statictip')
				.observe('click', function(){
					element.hideTip()
				});
			document.body.appendChild(element.tooltip.bulle);
			
			var position = element.positionedOffset();
			element.tooltip.show(text);
			element.tooltip.setPosition(position[0], position[1], options);
		}
		element.tooltip.effect = new sTip.showEffect(element.tooltip.bulle, {afterFinish: function () {element.tooltip.getPosition();} });
		
		return element;
	}
};

sTip = new SimpleTip();
sTip.listen();

Element.addMethods(Tips);
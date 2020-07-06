function relPoly(x, y, poly){
	return poly.map(p => {
		p[0] += x;
		p[1] += y;
		return p;
	});
}
const colors = {
	gray            : '#555555',
	light           : '#AAAAAA',
	road            : '#666', // >:D
	energy          : '#FFE87B',
	power           : '#F53547',
	dark            : '#181818',
	outline         : '#8FBB93',
	speechText      : '#000000',
	speechBackground: '#aebcc4',
	infoBoxGood     : '#09ff00',
	infoBoxBad      : '#ff2600'
};

const speechSize = 0.5;
const speechFont = 'Times New Roman';
//RoomVisual.prototype.infoBox = function (info, x, y, opts = {}) {
RoomVisual.prototype.structure = function(x, y, type, opts = {}){
	_.defaults(opts, {opacity: 0.5});
	switch (type) {
		case STRUCTURE_EXTENSION:
			this.circle(x, y, {
				radius     : 0.5,
				fill       : colors.dark,
				stroke     : colors.outline,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
			this.circle(x, y, {
				radius : 0.35,
				fill   : colors.gray,
				opacity: opts.opacity
			});
			break;
		case STRUCTURE_SPAWN:
			this.circle(x, y, {
				radius     : 0.65,
				fill       : colors.dark,
				stroke     : '#CCCCCC',
				strokeWidth: 0.10,
				opacity    : opts.opacity
			});
			this.circle(x, y, {
				radius : 0.40,
				fill   : colors.energy,
				opacity: opts.opacity
			});

			break;
		case STRUCTURE_POWER_SPAWN:
			this.circle(x, y, {
				radius     : 0.65,
				fill       : colors.dark,
				stroke     : colors.power,
				strokeWidth: 0.10,
				opacity    : opts.opacity
			});
			this.circle(x, y, {
				radius : 0.40,
				fill   : colors.energy,
				opacity: opts.opacity
			});
			break;
		case STRUCTURE_LINK: {
			// let osize = 0.3;
			// let isize = 0.2;
			let outer = [
				[0.0, -0.5],
				[0.4, 0.0],
				[0.0, 0.5],
				[-0.4, 0.0]
			];
			let inner = [
				[0.0, -0.3],
				[0.25, 0.0],
				[0.0, 0.3],
				[-0.25, 0.0]
			];
			outer = relPoly(x, y, outer);
			inner = relPoly(x, y, inner);
			outer.push(outer[0]);
			inner.push(inner[0]);
			this.poly(outer, {
				fill       : colors.dark,
				stroke     : colors.outline,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
			this.poly(inner, {
				fill   : colors.gray,
				stroke : false,
				opacity: opts.opacity
			});
			break;
		}
		case STRUCTURE_TERMINAL: {
			let outer = [
				[0.0, -0.8],
				[0.55, -0.55],
				[0.8, 0.0],
				[0.55, 0.55],
				[0.0, 0.8],
				[-0.55, 0.55],
				[-0.8, 0.0],
				[-0.55, -0.55],
			];
			let inner = [
				[0.0, -0.65],
				[0.45, -0.45],
				[0.65, 0.0],
				[0.45, 0.45],
				[0.0, 0.65],
				[-0.45, 0.45],
				[-0.65, 0.0],
				[-0.45, -0.45],
			];
			outer = relPoly(x, y, outer);
			inner = relPoly(x, y, inner);
			outer.push(outer[0]);
			inner.push(inner[0]);
			this.poly(outer, {
				fill       : colors.dark,
				stroke     : colors.outline,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
			this.poly(inner, {
				fill   : colors.light,
				stroke : false,
				opacity: opts.opacity
			});
			this.rect(x - 0.45, y - 0.45, 0.9, 0.9, {
				fill       : colors.gray,
				stroke     : colors.dark,
				strokeWidth: 0.1,
				opacity    : opts.opacity
			});
			break;
		}
		case STRUCTURE_LAB:
			this.circle(x, y - 0.025, {
				radius     : 0.55,
				fill       : colors.dark,
				stroke     : colors.outline,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
			this.circle(x, y - 0.025, {
				radius : 0.40,
				fill   : colors.gray,
				opacity: opts.opacity
			});
			this.rect(x - 0.45, y + 0.3, 0.9, 0.25, {
				fill   : colors.dark,
				stroke : false,
				opacity: opts.opacity
			});
		{
			let box = [
				[-0.45, 0.3],
				[-0.45, 0.55],
				[0.45, 0.55],
				[0.45, 0.3],
			];
			box = relPoly(x, y, box);
			this.poly(box, {
				stroke     : colors.outline,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
		}
			break;
		case STRUCTURE_TOWER:
			this.circle(x, y, {
				radius     : 0.6,
				fill       : colors.dark,
				stroke     : colors.outline,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
			this.rect(x - 0.4, y - 0.3, 0.8, 0.6, {
				fill   : colors.gray,
				opacity: opts.opacity
			});
			this.rect(x - 0.2, y - 0.9, 0.4, 0.5, {
				fill       : colors.light,
				stroke     : colors.dark,
				strokeWidth: 0.07,
				opacity    : opts.opacity
			});
			break;
		case STRUCTURE_ROAD:
			this.circle(x, y, {
				radius : 0.175,
				fill   : colors.road,
				stroke : false,
				opacity: opts.opacity
			});
			if (!this.roads) this.roads = [];
			this.roads.push([x, y]);
			break;
		case STRUCTURE_RAMPART:
			this.circle(x, y, {
				radius     : 0.65,
				fill       : '#434C43',
				stroke     : '#5D735F',
				strokeWidth: 0.10,
				opacity    : opts.opacity
			});
			break;
		case STRUCTURE_WALL:
			this.circle(x, y, {
				radius     : 0.40,
				fill       : colors.dark,
				stroke     : colors.light,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
			break;
		case STRUCTURE_STORAGE:
			const storageOutline = relPoly(x, y, [
				[-0.45, -0.55],
				[0, -0.65],
				[0.45, -0.55],
				[0.55, 0],
				[0.45, 0.55],
				[0, 0.65],
				[-0.45, 0.55],
				[-0.55, 0],
				[-0.45, -0.55],
			]);
			this.poly(storageOutline, {
				stroke     : colors.outline,
				strokeWidth: 0.05,
				fill       : colors.dark,
				opacity    : opts.opacity
			});
			this.rect(x - 0.35, y - 0.45, 0.7, 0.9, {
				fill   : colors.energy,
				opacity: opts.opacity,
			});
			break;
		case STRUCTURE_OBSERVER:
			this.circle(x, y, {
				fill       : colors.dark,
				radius     : 0.45,
				stroke     : colors.outline,
				strokeWidth: 0.05,
				opacity    : opts.opacity
			});
			this.circle(x + 0.225, y, {
				fill   : colors.outline,
				radius : 0.20,
				opacity: opts.opacity
			});
			break;
		case STRUCTURE_NUKER:
			let outline = [
				[0, -1],
				[-0.47, 0.2],
				[-0.5, 0.5],
				[0.5, 0.5],
				[0.47, 0.2],
				[0, -1],
			];
			outline = relPoly(x, y, outline);
			this.poly(outline, {
				stroke     : colors.outline,
				strokeWidth: 0.05,
				fill       : colors.dark,
				opacity    : opts.opacity
			});
			let inline = [
				[0, -.80],
				[-0.40, 0.2],
				[0.40, 0.2],
				[0, -.80],
			];
			inline = relPoly(x, y, inline);
			this.poly(inline, {
				stroke     : colors.outline,
				strokeWidth: 0.01,
				fill       : colors.gray,
				opacity    : opts.opacity
			});
			break;
		case STRUCTURE_CONTAINER:
			this.rect(x - 0.225, y - 0.3, 0.45, 0.6, {
				fill       : 'yellow',
				opacity    : opts.opacity,
				stroke     : colors.dark,
				strokeWidth: 0.10,
			});
			break;
		default:
			this.circle(x, y, {
				fill       : colors.light,
				radius     : 0.35,
				stroke     : colors.dark,
				strokeWidth: 0.20,
				opacity    : opts.opacity
			});
			break;
	}

	return this;
};
const dirs = [
	[],
	[0, -1],
	[1, -1],
	[1, 0],
	[1, 1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1]
];
RoomVisual.prototype.connectRoads = function(opts = {}){
	_.defaults(opts, {opacity: 0.5});
	const color = opts.color || colors.road || 'white';
	if (!this.roads) return;
	// this.text(this.roads.map(r=>r.join(',')).join(' '),25,23)
	this.roads.forEach((r) => {
		// this.text(`${r[0]},${r[1]}`,r[0],r[1],{ size: 0.2 })
		for (let i = 1; i <= 4; i++) {
			const d = dirs[i];
			const c = [r[0] + d[0], r[1] + d[1]];
			const rd = _.some(this.roads, r => r[0] == c[0] && r[1] == c[1]);
			// this.text(`${c[0]},${c[1]}`,c[0],c[1],{ size: 0.2, color: rd?'green':'red' })
			if (rd) {
				this.line(r[0], r[1], c[0], c[1], {
					color  : color,
					width  : 0.35,
					opacity: opts.opacity
				});
			}
		}
	});

	return this;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TEXT_COLOR = '#c9c9c9';
var TEXT_SIZE = .8;
var CHAR_WIDTH = TEXT_SIZE * 0.4;
var CHAR_HEIGHT = TEXT_SIZE * 0.9;
var Visualizer = class Visualizer {
    static textStyle(size, style) {
        if (size === void 0) { size = 1; }
        if (style === void 0) { style = {}; }
        return _.defaults(style, {
            color: TEXT_COLOR,
            align: 'left',
            font: size * TEXT_SIZE + " Trebuchet MS",
            opacity: 0.8,
        });
    }
    static text(text, pos, size, style) {
        if (size === void 0) { size = 1; }
        if (style === void 0) { style = {}; }
        new RoomVisual(pos.roomName).text(text, pos.x, pos.y, this.textStyle(size, style));
    }
    static barGraph(progress, pos, width, scale) {
        if (width === void 0) { width = 7; }
        if (scale === void 0) { scale = 1; }
        var vis = new RoomVisual(pos.roomName);
        var percent;
        var mode;
        if (typeof progress === 'number') {
            percent = progress;
            mode = 'percent';
        }
        else {
            percent = progress[0] / progress[1];
            mode = 'fraction';
        }
        this.box(vis, pos.x, pos.y - CHAR_HEIGHT * scale, width, 1.1 * scale * CHAR_HEIGHT, { color: TEXT_COLOR });
        vis.rect(pos.x, pos.y - CHAR_HEIGHT * scale, percent * width, 1.1 * scale * CHAR_HEIGHT, {
            fill: TEXT_COLOR,
            opacity: 0.4,
            strokeWidth: 0
        });
        if (mode == 'percent') {
            vis.text(Math.round(100 * percent) + "%", pos.x + width / 2, pos.y - .1 * CHAR_HEIGHT, this.textStyle(1, { align: 'center' }));
        }
        else {
            var _a = progress, num = _a[0], den = _a[1];
            vis.text(num + "/" + den, pos.x + width / 2, pos.y - .1 * CHAR_HEIGHT, this.textStyle(1, { align: 'center' }));
        }
    }
    static drawGraphs(){
        let cpu_value=(Game.cpu.getUsed() / Game.cpu.limit)
        if(cpu_value>=1){
            cpu_value=1.0;
        }
        this.text("CPU", { x: 1, y: 2.5 });
        this.barGraph(cpu_value, { x: 4.5, y: 2.5 });
        this.text(Math.ceil(Game.cpu.getUsed()*100)/100, { x: 13, y: 2.5 });
        this.text("BKT", { x: 1, y: 3.5 });
        this.barGraph((Game.cpu.bucket / 10000), { x: 4.5, y: 3.5 });
        this.text(Game.cpu.bucket, { x: 13, y: 3.5 });
        this.text("GCL", { x: 1, y: 4.5 });
        this.barGraph((Game.gcl.progress / Game.gcl.progressTotal), { x: 4.5, y: 4.5 });
        this.text("\u7B49\u7EA7:" + Game.gcl.level, { x: 13, y: 4.5 });
        this.text("GPL", { x: 1, y: 5.5 });
        this.barGraph((Game.gpl.progress / Game.gpl.progressTotal), { x: 4.5, y: 5.5 });
        this.text("\u7B49\u7EA7:" + Game.gpl.level, { x: 13, y: 5.5 });
        var i = 2.25;
        for (var room in Game.rooms) {
            try {
                if (Game.rooms[room].controller.my) {
                    i++;
                    var rclProgress = Game.rooms[room].controller.progress;
                    var rclProgressTotal = Game.rooms[room].controller.progressTotal;
                    var level = Game.rooms[room].controller.level;
                    if (Game.rooms[room].controller.level != 8) {
                        this.text(Game.rooms[room].name, { x: 1, y: (i + 5) });
                        this.barGraph((rclProgress / rclProgressTotal), { x: 4.5, y: (i + 5) });
                        if(Game.rooms[room].controller.ticksToDowngrade==CONTROLLER_DOWNGRADE[Game.rooms[room].controller.level]){
                            this.text("\u7B49\u7EA7:" + level + '  [↑]', { x: 12.5, y: (i + 5) });
                        }else{
                            this.text("\u7B49\u7EA7:" + level + '  [■]', { x: 12.5, y: (i + 5) });
                        }
                        this.text("" + (Game.rooms[room].controller.progressTotal - Game.rooms[room].controller.progress), { x: Game.rooms[room].controller.pos.x + 1, y: Game.rooms[room].controller.pos.y, roomName: room });
                    }
                    else {
                        this.text(Game.rooms[room].name, { x: 1, y: (i + 5) });
                        this.barGraph(Game.rooms[room].controller.ticksToDowngrade/CONTROLLER_DOWNGRADE[Game.rooms[room].controller.level], { x: 4.5, y: (i + 5) });
                        //this.text("\u7B49\u7EA7:" + level, { x: 13, y: (i + 5) });
                        if(Game.rooms[room].controller.ticksToDowngrade==CONTROLLER_DOWNGRADE[Game.rooms[room].controller.level]){
                            this.text("\u7B49\u7EA7:" + level + '  [■]', { x: 12.5, y: (i + 5) });
                        }else{
                            this.text("\u7B49\u7EA7:" + level + '  [↓]', { x: 12.5, y: (i + 5) });
                        }
                    }
                }
                else if (Game.rooms[room].controller.reservation.username == 'Mikoto') {
                    i++;
                    var reservationProgress = Game.rooms[room].controller.reservation.ticksToEnd;
                    var reservationTotal = 5000;
                    this.text(Game.rooms[room].name, { x: 1, y: (i + 5) });
                    this.barGraph([reservationProgress, reservationTotal], { x: 4.5, y: (i + 5) });
                    this.text("\u5df2\u9884\u5b9a  [↓]", { x: 12.5, y: (i + 5) });
                }
            }
            catch (error) {
            }
        }
    }
    static summary() {
        this.text("\u6709\u89C6\u91CE\u623F\u95F4\u6570\u91CF: " + _.keys(Game.rooms).length + " | Creep\u6570\u91CF: " + _.keys(Game.creeps).length, {
            x: 1,
            y: 1
        }, .93);
    }
    static box(vis, x, y, w, h, style) {
        return vis.line(x, y, x + w, y, style)
            .line(x + w, y, x + w, y + h, style)
            .line(x + w, y + h, x, y + h, style)
            .line(x, y + h, x, y, style);
    }
    static visuals() {
        this.drawGraphs();
        this.summary();
    }
}
//Visualizer.visuals();
module.exports = Visualizer;
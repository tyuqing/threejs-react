// 来源：https://www.thingjs.com/guide/?m=sample&f=%E6%9C%BA%E6%88%BF

document.title = 'Demo-机房管理';
/**
 * 机房demo
 * @author larrow 2018.05.01
 */
var app = new THING.App({ 
    url: 'models/comproom/'
});

app.on('load', function() {
    // 摄影机飞行到合适位置
    app.camera.flyTo({
        time: 1000,
        position: [-15.8, 14.3, 17.9],
        target: [0.3, -2.0, 1.5]
    });
    
    // 初始化机柜等物体
    init_cabinets();

    // 初始化界面
    init_ui();
});

// ------------------------------------------------------------------------------
// 机柜相关
const CABINET_DEFAULT_UNITCOUNT = 42; // 默认机柜u数
const RACK_UNIT_HEIGHT = 0.0445; // 1u为4.3厘米
const BarGraphColors = ['#0000ff', '#00ffff', '#00ff00', '#ff0000', '#ff00ff', '#ffff00'];

/**
 * Cabinet 机柜类
 */
class Cabinet extends THING.Thing {
    constructor(app) {
        super(app);
        this.racks = [];
        this.isCabinet = true;
        this.barGraph = null;
        this.ui = null;
        this.number = Math.randomInt(100, 300);
    }

    createRack(url, u) {
        var y = u * RACK_UNIT_HEIGHT;
        var cabinet = this;
        var rack = this.app.create({
            type: 'Rack',
            name: 'rack',
            url: url,
            complete: function() {
                cabinet.add({
                    object: this,
                    basePoint: 'BasePoint',
                    localPosition: [0, y, 0],
                    localAngles: [0, 0, 0]
                });

            }
        });
        return rack;
    }

    createRacks() {
        var curUPos = 0;
        while(true) {
            var pair = RackModels[Math.randomInt(0, RackModels.length - 1)];
            var url = pair[0];
            var uHeight = pair[1];

            var rack = this.createRack(url, curUPos);
            this.racks.push(rack);

            if (curUPos >= CABINET_DEFAULT_UNITCOUNT - 4)
                break;

            curUPos += uHeight;
        }
        return rack;
    }

    destroyRacks() {
        for (var i = 0; i < this.racks.length; i ++) {
            var rack = this.racks[i];
            rack.destroy();
        }
        this.racks = [];
    }

    openDoor() {
        this.playAnimation('open1');
        this.createRacks();
    }

    closeDoor() {
        this.playAnimation({
            name: 'close1',
            complete: function() {
                this.destroyRacks();
                if (Rack.current)
                    Rack.current.showUI(false);
            }
        });
    }

    // 创建柱状图
    createBarGraph() {
        if (this.barGraph)
            return;

        var box = app.create({ 
            type: 'Box', 
            width: this.size[0] * 0.9,
            height: this.size[1],
            depth: this.size[2] * 0.9,
            position: this.position,
            center: 'Bottom'    
        });

        this.barGraph = box;
    }

    // 显示柱状图
    showBarGraph(bool) {
        if (bool) {
            // 确认创建了盒子
            this.createBarGraph();
            // 隐藏机柜，显示盒子
            this.visible = false;
            this.barGraph.visible = true;
            this.barGraph.style.color = Math.randomFromArray(BarGraphColors);
            //this.barGraph.style.opacity = 0.9;
            // 缩放盒子
            this.barGraph.scale = [1, 0.1, 1];
            this.barGraph.scaleTo({
                scale: [1, Math.randomFloat(0.2, 1.0), 1],
                time: 400,
                lerpType: THING.LerpType.Linear.Quadratic
            });
        } else {
            // 隐藏盒子，显示机柜
            this.visible = true;
            if (this.barGraph)
                this.barGraph.visible = false;
        }
    }

    // 创建界面
    createUI() {
        if (this.ui)
            return;
        var cabinet = this;

        // 创建widget (动态绑定数据用)
        var panel = new THING.widget.Panel({
            width: "230px",
            closeIcon: false,
            opacity: 0.8,
        });
        this.panel = panel;
        panel.addString(this, 'name').name('机柜'+this.number);

        // 创建obj ui (跟随物体用)
        var ui = app.create({
            type: 'UI',
            parent: this,
            el: panel.domElement,
            offset: [0, cabinet.size[1], 0]
        });
        this.ui = ui;   
    }

    // 显示界面
    showUI(boolValue) {
        if (!this.ui)
            this.createUI();

        this.panel.visible = boolValue;
    }
}
THING.factory.registerClass('Cabinet', Cabinet);
Cabinet.current = null;
Cabinet.open = false;

// 架式设备模型
const RackModels = [
    ['https://model.3dmomoda.cn/models/3817338017ff4776a5dd05f03a3e2fd4/0/gltf', 1], 
    ['https://model.3dmomoda.cn/models/37972dd2c96c4a37a3245a00bee3628b/0/gltf', 2]
];

/**
 * Rack 架式设备
 */
class Rack extends THING.Thing {
    constructor(app) {
        super(app);
        this.isRack = true;
        this.info = gen_rack_info();
    }

    createUI() {
        var ui = new THING.widget.Panel({
            titleText: this.name,
            closeIcon: true,
            dragable: true,
            retractable: true,
            hasTitle: true,
            width: "228px",
        });
        ui.zIndex = 999999;//设置ui排序
        ui.addTab(this.info);
        ui.position = [390, 350];
        this.ui = ui;
        return ui;
    }

    showUI(boolValue) {
        if (!this.ui)
            this.createUI();
        this.ui.show(boolValue);
    }
}
THING.factory.registerClass('Rack', Rack);
Rack.current = null;

function gen_rack_info() {
    var type2 = ["PC服务器", "路由器"];
    var type3 = ["IBM", "HP", "DELL"];
    var people = ["王WW", "李LL", "张ZZ"];
    var info = {
        "基本信息": {
            "一级分类": "微机",
            "二级分类": type2[Math.randomInt(0,1)],
            "设备类型": type3[Math.randomInt(0,2)],
            "编号": "00" + Math.randomInt(0, 9),
            "使用人": people[Math.randomInt(0,2)],
            "管理员": people[Math.randomInt(0,2)],
            "上架时间": ""+Math.randomInt(10,23)+":"+Math.randomInt(10,23),
        },
        "扩展信息": {
            "信息XX": Math.ceil(Math.random() * 27 + 25) + "",
            "信息YY": Math.ceil(Math.random() * 25 + 20) + "",
            "信息ZZ": Math.ceil(Math.random() * 27 + 25) + "",
            "信息AA": Math.ceil(Math.random() * 25 + 20) + "",
            "信息BB": Math.ceil(Math.random() * 27 + 25) + "",
            "信息CC": Math.ceil(Math.random() * 25 + 20) + "",
            "信息DD": Math.ceil(Math.random() * 25 + 20) + "",
        }
    };
    return info;
}

// 初始化机柜
function init_cabinets() {
    var cabinets = app.query('.Cabinet');

    // 双击左键开门
    cabinets.on('dblclick', function() {

        // 摄影机飞行
        var pos = this.selfToWorld([0, 2.0, 2.1]);
        //var pos = this.selfToWorld([-0.6, 1.1, 2.3]);
        var targ = this.position;
        targ[1] += 0.95;
        app.camera.flyTo({
            time: 1000,
            position: pos,
            target: targ, 
        });

        // 机柜开门动画
        if (Cabinet.current) {
            Cabinet.current.closeDoor();
            Cabinet.current = null;
        }
        this.openDoor();

        // 设置为当前
        Cabinet.current = this;        
        this.style.outlineColor = null; // 当前机柜不沟边
    })

    // 右键关门
    app.on('click', function(event) {
        if (event.button == 2) {
            if (Cabinet.current) {
                Cabinet.current.closeDoor();
                Cabinet.current = null;
            } else {
                // 如果没有当前机柜则飞到一个最佳位置
                app.camera.flyTo({
                    time: 1500,
                    position: [-10.4, 13.6, 12.3],
                    target: [3.6, -4, -1.7], 
                });
            }
        }
    });

    // 机柜 滑过沟边
    cabinets.on('mouseon', function () {
        if (this != Cabinet.current) {
            this.style.outlineColor = '#00ff00';
            this.showUI(true);
        }
    });
    cabinets.on('mouseoff', function () {
        this.style.outlineColor = null;
        this.showUI(false);
    });

    // 架式服务器事件（尚未创建，预先注册）
    app.on('mouseon', '.Rack', null, function (ev) {
        this.style.outlineColor = '#ff0000';
    });
    app.on('mouseoff', '.Rack', null, function (ev) {
        this.style.outlineColor = null;
    });
    app.on('click', '.Rack', null, function (ev) {
        if (Rack.current == ev.object)
            return;

        if (Rack.current) {
            Rack.current.showUI(false);
            Rack.current = null;
        }
        Rack.current = ev.object;
        ev.object.showUI(true);
    });
}

// ------------------------------------------------------------------------------
// 一个工具面板
function init_ui() {
    new THING.widget.Button('开场动画', function() {
        openingShow.start();
        app.query('.Cabinet').forEach(function(obj) {
            obj.showBarGraph(false);
        });
    });
    
    var showBar = true;
    new THING.widget.Button('空间统计', function() {
        openingShow.stop();
        app.query('.Cabinet').forEach(function(obj) {
            obj.showBarGraph(showBar);
        });
        showBar = !showBar;
    });

}

// ------------------------------------------------------------------------------
// 开场秀
openingShow = {
    curShowIdx: 0,  // 当前进行的是哪一场show
    objCount: 0,      // 计算有多少物体已经完成了表演
    showing: false,
    showInfo: null,
    inited: false,

    init: function() {
        var that = this;

        // 每次show的对象 查询字符串、时间、摄影机位置
        this.showInfo = [
            [ "[Group=Inside01]", 500, [-7.1, 8.8, 9.2], [-3.1, 3, 0.2] ],
            [ "[Group=Inside02]", 500, [-9.5, 8.6, 11.7], [-3.5, 3, 5.3] ],
            [ "[Group=Inside03]", 500, [13.9, 9.3, 15.1], [8.9, 3, 5.8] ],
            [ "[Group=Inside04]", 500, [19.9, 10.3, 7.9], [16.5, 3, 3.9] ],
            [ "[Group=Inside05]", 500, [27.3, 11.5, 11.8], [23.3, 3, 4.4] ],
        
            [ "[Group=Outside01] | [Group=Outside03]", 300, [10.3, 45.7, 28], [9.7, 3.1, 4.5] ],
            [ "[Group=Outside02] | [Group=Outside04]", 300, [-10.3, 21.2, 32.7], [6.6, 3, 0.7] ],
        ];

        // 注册取消事件
        app.on('keydown', function(event) {
            if (event.key == "Escape") {
                that.stop();
            }
        })

        this.inited = true;
    },

    // 开始show
    start: function() {
        if (this.showing)
            return;
        if (!this.inited)
            this.init();
        this.showing = true;

        // 所有具有属性Group值包含Inside的都抬高
        app.query("[Group=Inside*]").forEach(function(obj) {
            obj.visible = false;
            obj.initPos = obj.position; // 保存一下初始位置
            obj.translate([0, 10, 0]);
        });
        // 所有具有属性Group值包含Outside的都偏移z
        app.query("[Group=Outside*]").forEach(function(obj) {
            obj.visible = false;
            obj.initPos = obj.position; // 保存一下初始位置
            obj.translate([0, 0, 10]);
        });

        this.step();
    },

    // 每一个show的过程
    step: function() {
        var info = this.showInfo[this.curShowIdx];
        var queryString = info[0];
        var costTime = info[1];
        var camPos = info[2];
        var camTarget = info[3];
        var nextNow = info[4];

        // 摄影机飞行
        var that = this;
        app.camera.flyTo({
            time: 800,
            position: camPos,
            target: camTarget, 
            complete: function() {
                // 机柜等设备飞入效果
                var dealyTime = 0;
                var objIdx = 0;
                app.query(queryString).forEach(function(obj) {
                    that.objCount ++;
                    obj.visible = true;
                    obj.moveTo({
                        position: obj.initPos,
                        time: costTime,
                        delayTime: dealyTime,
                        lerp: true,
						lerpType: THING.LerpType.Cubic.In,
                        complete: function() {
                            that.next();
                        }
                    });

                    // 逐步提高速度
                    dealyTime = (objIdx > 16)  ?  (dealyTime + 30) : (dealyTime + 100); // 延时加速
                    objIdx ++;
                });
            }
        });
    }, 

    // 下一次show的判断
    next: function() {      
        if (!this.showing)      
            return;

        // 本场show演员还没全部完成
        this.objCount --;
        if (this.objCount > 0) 
            return;

        // 全部结束
        this.curShowIdx ++;
        if (this.curShowIdx >= this.showInfo.length) {
            this.showing = false;
            this.curShowIdx = 0;
            console.log('all show finish!');
            return;
        }

        // 下一show
        this.step();
    },

    stop: function() {
        app.query("[Group]").forEach(function(obj) {
            obj.stopMoving();
            obj.visible = true;
            obj.position = obj.initPos
        });

        app.camera.stopFlying();
           
        this.objCount = 0;
        this.curShowIdx = 0;
        this.showing = false;
    }
}
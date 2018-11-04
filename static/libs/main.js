var map, tb, ctxMenuForGraphics;
var selected;

require([
    "esri/Map",
    "esri/layers/TileLayer",
    // "esri/layers/ArcGISDynamicMapServiceLayer",
    // "dojo/_base/connect",
    // "esri/dijit/BasemapToggle",
    "esri/views/2d/draw/Draw",
    "esri/geometry/Polygon",
    // "esri/geometry/Polyline",
    "esri/widgets/Search",
    // "dijit/registry",
    "esri/widgets/ScaleBar",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    // "esri/symbols/PictureFillSymbol",
    // "esri/symbols/CartographicLineSymbol",
    // "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/Extent",
    "esri/geometry/SpatialReference",
    // "esri/geometry/Point",
    // "esri/geometry/mathUtils",
    // "esri/geometry/ScreenPoint",
    // "esri/toolbars/edit",
    "dijit/Menu",
    "dijit/MenuItem",
    // "dijit/MenuSeparator",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/Color",
    "esri/widgets/Popup",
    // "esri/dijit/PopupTemplate",
    // "esri/InfoTemplate",
    "esri/symbols/SimpleLineSymbol",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on",
    // "dojo/domReady!"
], function (
    Map,
    ArcGISTiledMapServiceLayer,
    // ArcGISDynamicMapServiceLayer,
    // connect,
    // BasemapToggle,
    Draw,
    // Polygon,
    // Polyline,
    Search,
    // registry,
    Scalebar,
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    // PictureFillSymbol,
    // CartographicLineSymbol,
    // PictureMarkerSymbol,
    Extent,
    SpatialReference,
    Point,
    mathUtils,
    ScreenPoint,
    Edit,
    Menu,
    MenuItem,
    MenuSeparator,
    Graphic,
    GraphicsLayer,
    Color,
    Popup,
    PopupTemplate,
    InfoTemplate,
    SimpleLineSymbol,
    domConstruct,
    dom,
    on,
    // domAttr
) {
    //创建popup弹出层
    var popup = new Popup(null, domConstruct.create("div"));

    //地图
    map = new Map("map", {
        center: [121.47003707885744, 31.24853148977224],
        zoom: 7,
        infoWindow: popup,
        extent: new Extent(-122.68, 45.53, -122.45, 45.60, new SpatialReference({
            wkid: 4326
        }))
    });

    //添加地图图层
    var mapServiceURL = "https://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer";
    map.addLayer(new ArcGISTiledMapServiceLayer(mapServiceURL));

    //初始化比例尺
    var scalebar = new Scalebar({
        map: map,
        attachTo: "bottom-left",
        scalebarUnit: "dual",
    });

    //显示比例尺
    scalebar.show();

    //创建图层
    var gl = new GraphicsLayer({
        id: "draw"
    });
    map.addLayer(gl);

    map.on("load", initToolbar);

    createGraphicsMenu();

    //创建右键菜单
    function createGraphicsMenu() {
        ctxMenuForGraphics = new Menu({});

        ctxMenuForGraphics.addChild(new MenuItem({
            label: "删除",
            onClick: function () {
                gl.remove(selected)
            }
        }));

        //当鼠标在gl图层的图形上方时绑定该图形的点击事件
        gl.on("mouse-over", function (evt) {
            selected = evt.graphic;
            ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
        });

        //当鼠标移出gl图层的图形上方时取消绑定该图形的点击事件
        gl.on("mouse-out", function (evt) {
            ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
        });
    }

    //启动右键菜单
    ctxMenuForGraphics.startup();

    //点击地图响应
    map.on("click", function (e) {
        //点击空白处隐藏popup
        if (e.graphic == undefined) {
            popup.hide();
        }
    });

    //搜索框
    var search = new Search({
        map: map,
        graphicsLayer: gl,
    }, "search");
    search.startup();

    //弹出框信息
    gl.on("click", function (e) {
        var detailInfo = '图形: ' + e.graphic.geometry.cache.geoShape + '<br>'
        popup.setTitle('图形信息');
        popup.setContent(detailInfo);
        popup.show(e.mapPoint);
    });


    //用来展示点的symbol
    var markerSymbol = new SimpleMarkerSymbol();
    markerSymbol.setColor(new Color("#00FFFF"));

    // 用来展示线的symbol
    var lineSymbol = new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([255, 0, 0]), 2,
        SimpleLineSymbol.CAP_ROUND,
        SimpleLineSymbol.JOIN_MITER, 5
    );

    //用来展示面的symbol
    var fillSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color('#000'),
            1
        ),
        new Color([255, 0, 0, 0.1])
    );

    //初始化工具栏
    function initToolbar() {
        tb = new Draw(map);
        tb.on("draw-end", addGraphic);

        on(dom.byId("info"), "click", function (evt) {
            if (evt.target.id === "info") {
                return;
            }
            var tool = evt.target.id.toLowerCase();
            map.disableMapNavigation();
            tb.activate(tool);
        });
    }

    //添加图形
    function addGraphic(evt) {
        tb.deactivate();
        map.enableMapNavigation();

        var symbol;
        if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
            symbol = markerSymbol;
        } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
            symbol = lineSymbol;
        } else {
            symbol = fillSymbol;
        }

        evt.geometry.setCacheValue("geoShape", evt.geometry.type);

        gl.add(new Graphic(evt.geometry, symbol));
    }
});
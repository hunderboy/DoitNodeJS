/**
 * 모듈에 대해 알아보기
 * 
 * CoffeeShopSchema 객체 만들기
 * 
 * ===== GeoSpatial Schema Definition =====
 * 
 * Geometry
 * 		'type': {type: String, enum: ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"] },
 * 		coordinates: []
 * 
 * Point
 * 		'type': {type: String, 'default': "Point"},
 * 		coordinates: [{type: "Number"}]
 * 
 * MultiPoint
 * 		'type': {type: String, default: "MultiPoint"},
 *		coordinates: [{type: "Array"}]
 * 
 * MultiLineString
 * 		'type': {type: String, default: "MultiLineString"},
 *		coordinates: [{type: "Array"}]
 *
 * Polygon
 * 		'type': {type: String, default: "Polygon"},
 *		coordinates: [{type: "Array"}]
 *
 * MultiPolygon
 * 		'type': {type: String, default: "MultiPolygon"},
 *		coordinates: [{type: "Array"}]
 * 
 * GeometryCollection
 * 		'type': {type: String, default: "GeometryCollection"},
 * 		geometries: [Geometry]
 * 
 * Feature
 * 		id: {type: "String"},
 *		'type': {type: String, default: "Feature"},
 *		geometry: Geometry,
 *		properties: {type: "Object"}
 * 
 * FeatureCollection
 * 		'type': {type: String, default: "FeatureCollection"},
 *		features: [Feature]
 *
 * 
 */

var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 스키마 정의
	var CoffeeShopSchema = mongoose.Schema({
	    name: {type: String, index: 'hashed', 'default':''},
	    address: {type: String, 'default':''},
	    tel: {type: String, 'default':''},
	    geometry: {
	    	'type': {type: String, 'default': "Point"},
	    	coordinates: [{type: "Number"}]
	    },
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	CoffeeShopSchema.index({geometry:'2dsphere'});

    
    
    
    
    
    
	// 스키마에 static 메소드 추가
	// 1. 모든 커피숍 조회
	CoffeeShopSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	// 2. 가장 가까운 커피숍 조회
    // 내 위치 위경도 넘겨주고, 거리를정하여 한정된 반경 내에서 찾기
	CoffeeShopSchema.static('findNear', function(longitude, latitude, maxDistance, callback) {
		console.log('CoffeeShopSchema의 findNear 호출됨.');

		this.find().where('geometry').near({
            center:{
                type:'Point', 
                coordinates:[parseFloat(longitude), parseFloat(latitude)]
            }, 
            maxDistance:maxDistance
        }).limit(1).exec(callback); // 검색된 1개의 데이터만 리턴되게끔 limit(1)
	});
	
	// 3. 일정 범위 내의 커피숍 조회
	CoffeeShopSchema.static('findWithin', function(topleft_longitude, topleft_latitude, bottomright_longitude, bottomright_latitude, callback) {
		console.log('CoffeeShopSchema의 findWithin 호출됨.');

		this.find().where('geometry').within({box:[[parseFloat(topleft_longitude), parseFloat(topleft_latitude)], [parseFloat(bottomright_longitude), parseFloat(bottomright_latitude)]]}).exec(callback);
	});
	
	// 4. 일정 반경 내의 커피숍 조회
	CoffeeShopSchema.static('findCircle', function(center_longitude, center_latitude, radius, callback) {
		console.log('CoffeeShopSchema의 findCircle 호출됨.');
		
		// change radian : 1/6371 -> 1km
		this.find().where('geometry').within({center:[parseFloat(center_longitude), parseFloat(center_latitude)], radius: parseFloat(radius/6371000), unique: true, spherical: true}).exec(callback);
	});
	
    
    
    
    
    
    
    
	console.log('CoffeeShopSchema 정의함.');

	return CoffeeShopSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;


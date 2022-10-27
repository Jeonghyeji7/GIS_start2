import React, { useState, useEffect } from "react";
import "ol/ol.css"; //스타일
import { Feature, Map as OlMap, View } from "ol"; //뷰 관리
import { fromLonLat, get as getProjection } from "ol/proj"; //위경도
import { Tile as TileLayer } from "ol/layer"; //지도 타일
import { XYZ } from "ol/source"; //지도정보
import { LineString, Point, Polygon } from "ol/geom";
import Style from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Layout from '../components/Layout';




const VWORLD_API_KEY = `FA92A59A-B342-3B1A-B4AB-B96B2E8487DB`;

const Map = () => {
  //지도정보 - 객체형태
  const [mapObj, setMapObj] = useState({});

  //GIS 환경내에서 객체 - 풍경에서 볼 수 있는 무언가, 사물들 하나하나
  //Vector - GIS 환경 내에서 실제 세계의 객체(feature) 를 표현하는 방법 가운데 하나, 도형(geometry) 을 사용해서 그 형태를 표현
  //지도의 좌표를 저장하는 객체

  //? Feature->VectorSource->VectorLayer->map의 layers

  const iconFeature = new Feature({
    geometry: new Point([127.40603329901171, 36.4241685689192]).transform(
      "EPSG:4326",
      "EPSG:3857"
    ),
  });

  const iconFeatureEtri = new Feature({
    geometry: new Point([127.367585, 36.381761]).transform(
      "EPSG:4326",
      "EPSG:3857"
    ),
  });

   //? ✔️ fromLonLat() 메서드에 배열로 경도, 위도 순으로 좌표 값을 입력
  const lineFeature = new Feature({
    geometry: new LineString([
      fromLonLat([127.40603329901171, 36.4241685689192]),
      fromLonLat([127.367585, 36.381761]),
    ]),
  });

  const polygonFeature = new Feature({
    geometry: new Polygon([
      [
        [14182794.279262094, 4358994.281566766],
        [14182820.63185949, 4359025.383787327],
        [14182764.81266754, 4359073.707200448],
        [14182754.655518875, 4359061.298308213],
        [14182743.760177676, 4359071.454086633],
        [14182799.74840243, 4359139.82847911],
        [14182866.759170225, 4359084.441491674],
        [14182907.517756274, 4359131.422089443],
        [14182778.928222502, 4359239.671861718],
        [14182671.171457674, 4359100.008479948],
        [14182791.940672643, 4358992.332582034],
      ],
    ]),
  });
  //polygonFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

// let marker = [
//   [126.93049836012368, 37.3926640521784,도시가스 배관 인입관 공사],
//   []
// ]

  const vectorSource = new VectorSource({
    features: [iconFeature, iconFeatureEtri, lineFeature, polygonFeature],
  });

  //좌표를 저장할 Object(공간)을 생성 - 점,선,면과 같은 요소
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      //아이콘
      image: new Icon({
        anchor: [0.5, 46], //?백분률(여기서는 0.5이므로 50%)로 지정하고, Y 축에 대한 값인 46의 단위는 anchorYUnits 속성을 통해 픽셀 단위로 지정한다는 의미
        anchorXUnits: "fraction", //?
        anchorYUnits: "pixels", //?
        src: "/mm.png",
        opacity: 1, //투명도 1=100%
        scale: 0.1, //크기 1=100%
      }),
      //linestring의 스타일 지정
      stroke: new Stroke({
        width: 3,
        color: [255, 0, 0, 1],
      }),
      //면 스타일
      fill: new Fill({
        color: [0, 0, 255, 0.6],
      }),
    }),
  });

  // 웹 페이지를 구성시킬 요소들이 렌더링 및 클라이언트로 로드되기 전에 document에 접근하여 View 요소를 조작하려하니 발생한 문제
  //SSR 방식으로 페이지 접속 시 DOM을 접근하는 방법-> useEffect 컴포넌트의 렌더링을 마치고 실행되는 함수이며, 클라이언트 단에서 실행
  useEffect(() => {
    console.log("객체생성 시점 map obj");

    //* new Map
    //Map 객체 생성으로 맵을 렌더링 하기 위해 뷰(view), 하나 이상의 레이어 및(layer) 대상 컨테이너(target) 필요
    const map = new OlMap({
      //* new View : 사용자가 현재 맵을 바라보는 방식의 정보, 지도 보는 방식 설정, 지도의 중심, 해상도 및 회전을 변경하기 위해 수행할 객체
      view: new View({
        //* center : 지도 중심 좌표, 뷰의 초기 중심
        //? 왜 fromLonLat삭제하면 -> corb 오류?
        //경도, 위도 순으로 좌표 입력 : 경도:Longitude,위도:Latitude, 
        center: fromLonLat([127.40603329901171, 36.4241685689192]),
        //* 지도 zoom단계 : 뷰의 초기 해상도를 계산하는 데 사용되는 줌 레벨
        zoom: 15, //? 초기화면 zoom level
      }),
      //*layer
      //layer를 정의하지 않으면 레이어가 없는 맵이 렌더링 됨, 레이어는 제공된 순서대로 렌더링
      // ✔ layer를 생성하고 조작하는 프로퍼티 및 함수로 구성된 클래스
      // ✔ Map 컨테이너 위에 여러 개의 Layers를 등록하여 보여줄 수 있음
      layers: [
        //사용할 지도 타입(Tile) 선택 및 사용할 Vector을 적용시킨다. layers[타일, Vector1, Vector2...]
        //* new Tile
        //빠른 서비스를 위해 지도를 줌 레벨별로 미리 잘라서 정적 이미지 형태로 관리, 통짜로 관리하는 것보다 일정 규격으로 지도를 잘라서 관리하는 것이
        //효율적으로 이득, 큰 지도를 자르지 않고 통짜로 보관하게 되면 이미지 용량을 브라우저가 감당 못함!
        //특정 해상도의 확대/축소 수준으로 구성된 격자로 미리 렌더링 된 타일 이미지를 제공하는 레이어 소스 용으로
        //source라는 필수 값
        new TileLayer({
          //* source: new XYZ({}) -> XYZ 타일이란?
          //지도를 이루는, 자리가 정해진 작은 타일을 불러와 보도블록으로 인도를 채우듯이 지도를 완성하는 방식
          //지도를 구성하는 조각의 x좌표와 y좌표, z는 zoom의 약자 배율 의미
          //{z}/{y}/{x} -> 이 부분은 후에 view에서 지정한 초기값으로 지정되고, 지도가 움직임에 따라 값이 자동으로 입력된다 (자동으로 채워진다)
          source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
          }),
        }),
        vectorLayer
      ],
      //* target -> 지도 자체의 컨테이너 또는 요소의 컨테이너이며 element의 id값 지정, div id가 map인 엘리먼트에 맵을 표출
      target: "map"
    });
    setMapObj({ map });
  }, []);

  





  

  return (
    <Layout>
   <h1>안양시 도로굴착공사 위치안내서비스</h1>
   <p className="lead">본서비스는 안양시 공공데이터포털과 다음지도API를 사용하여 (주)지오투정보기술에서 제작하였습니다.</p>
   <p> Copyright 2018. Geotwo Co all rights reserved.</p>
   <a href="http://www.anyang.go.kr/">
    <img src="http://www.aroadservice.co.kr/logo.jpg" alt="AnyangCityLogo"/>
   </a>
   <a href="http://geotwo.com/">
    <img width="300"  src="/geotwo_logo.png" alt="GeotwoLogo" className="img-thumbnail"/>
   </a>
   <div className="text-right">
    <div className="form-group">
      <div className="input-group date" id="datetimepicker6">
        <input type="text" id="start_index" className="form-control" placeholder="공사시작일자"></input>
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-calendar">
          </span>
        </span>
      </div>
    </div>
    <div className="form-group">…</div>
   </div>
      <div
        id="map"
        style={{ position: "relative", height: "700px" }}
      >
      </div>
    </Layout>
  );
};

export default Map;

// 공간데이터(지리정보데이터) GIS(Geospatial Information System)

//GIS data-vector, raster(격자) -> 현실세계
//vector
//공간 - 점 point , 선 line , 면 polygon(다각형)
//공간에 점 하나 - 점 - 하나의 x,y - 주로 어떤 도시기반시설, 건물, 교차로(node) 등을 나타낼 때 사용한다.
//많은점 - 선 - 다수의 x,y 가장 처음 x,y과 마지막 x,y가 달라야한다. - 주로 도로, 경로, 네트워크, 어떤 면의 중심선, 철도 등을 나타낼 때 사용한다.
//많은선 - 면 - 다수의 x,y 가장 처음 x,y와 x,y가 서로 같아야함??? - 주로 어떤 지역, 군, 영역등을 나타낼 때 사용한다.
//2차원에서는 점,선,면으로 온전한 공간을 구현 가능 -> openlayers는 2차원 형태의 지도

//경도 longitude(세로죄표)-본초자오선(영국지나는 세로선-0)기준-동서 - -180~180
//위도 latitude(가로죄표)(위아래 위도)-남북- -90(남극)~90(북극)

//좌표계
//? European Petroleum Survey Group - EPSG 표준코드 : 다양한 좌표계를 코드로 표현하는 것
// 전지구 좌표계: 전세계를 한번에 나타내야 할 때 많이 쓰이는 좌표계, 전세계를 한번에 표현
// 1. EPSG:3857 → Google Mercator 
// 서비스: 구글 지도(Google Maps), 빙 지도(Bing Maps), 야후지도, OSM(Open Street Maps)
// 단위: 미터
// 2. EPSG:4326 → WGS84 경위도: GPS가 사용하는 좌표계 : 위경도, 기본좌표계 
// GPS (Global Positioning-위치잡이- System) :  GPS 위성에서 보내는 신호를 수신해 사용자의 현재 위치를 계산하는 위성항법시스템, 군용->민간
// WGS84 World Geodetic-측지참조- System
// GPS는 미 국방성이 1984년에 채택한 GPS용 타원체(WGS84의 기준이 되는 타원체)
// 서비스: 구글 지구(Google Earth)
// 단위: 소수점 (decimal degrees)



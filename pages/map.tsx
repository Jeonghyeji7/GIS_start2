import React, { useState, useEffect } from "react";
import "ol/ol.css"; //스타일
import { Feature, Map as OlMap, View } from "ol"; //뷰 관리
import {
  defaults as defaultControls,
  FullScreen
} from "ol/control";
import { fromLonLat } from "ol/proj"; //위경도
import { Tile as TileLayer } from "ol/layer"; //지도 타일
import { XYZ } from "ol/source"; //지도정보
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from "ol/interaction";
import { LineString, Point, Polygon } from "ol/geom";
import Style from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

const VWORLD_API_KEY = `FA92A59A-B342-3B1A-B4AB-B96B2E8487DB`;

const Map = () => {
  //지도정보가 객체형태로 받음
  const [mapObj, setMapObj] = useState({});

  //Vector
  //지도의 좌표를 저장하는 객체
  //Feature->VectorSource->VectorLayer->map의 layers

  //! 마커
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

  //! 선
  const lineFeature = new Feature({
    geometry: new LineString([
      fromLonLat([127.40603329901171, 36.4241685689192]),
      fromLonLat([127.367585, 36.381761]),
    ]),
  });

  //! 폴리곤
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

  const vectorSource = new VectorSource({
    features: [iconFeature, iconFeatureEtri, lineFeature, polygonFeature],
  });

  //좌표를 저장할 Object(공간)을 생성한다.
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "/mm.png",
        opacity: 1, //투명도 1=100%
        scale: 0.1, //크기 1=100%
      }),
      zIndex: 10,
      stroke: new Stroke({
        width: 3,
        color: [255, 0, 0, 1],
      }),
      fill: new Fill({
        color: [0, 0, 255, 0.6],
      }),
    }),
  });

  useEffect(() => {
    console.log("객체생성 시점 map obj");

    //! Map 객체 생성 및 vworld 지도 설정
    //* new Map
    //Map 객체 생성으로 맵을 렌더링 하기 위해 뷰(view), 하나 이상의 레이어 및(layer) 대상 컨테이너(target) 필요
    const map = new OlMap({
      //* new View : 지도의 설정은 View안에서 처리
      //지도 보는 방식 설정, 객체는 지도의 간단한 2D 뷰를 나타 냄, 지도의 중심, 해상도 및 회전을 변경하기 위해 수행할 객체
      view: new View({
        //* projection
        //구글 지도의 경/위도를 사용할 것이기 때문에 EPSG:3857값으로 지정
        //좌표계 결정 및 해상도 단위(픽셀 당 투영 단위) 결정
        //projection: "EPSG:3857",
        //* center
        //지도 중심 좌표, 뷰의 초기 중심, 중심 좌표계는 projection 옵션으로 지정되며 기본값은 undefined
        //OpenLayers는 경도, 위도 순으로 좌표 입력 : 위도: Latitude, 경도: Longitude
        //✔️ fromLonLat() 메서드에 배열로 경도, 위도 순으로 좌표 값을 입력한 후 get() 메서드를 두 번째 인자로 넣으므로써 projection을 지정해 준다.
        // center: fromLonLat(
        //   [126.9779228388393, 37.56643948208262], //[경도, 위도] 값 설정! 시청
        //   getProjection("EPSG:3857")
        // ),
        center: new Point([127.40603329901171, 36.4241685689192])
          .transform("EPSG:4326", "EPSG:3857")
          .getCoordinates(),
        //* 지도 zoom단계 : 뷰의 초기 해상도를 계산하는 데 사용되는 줌 레벨
        zoom: 15, // 초기화면 zoom level
        //maxZoom : 30, // 최대 zoom level
        //minZoom: 10, // 최소 zoom level
        //rotation: 0.5, //지도를 시계방향으로 돌림
      }),
      controls: defaultControls({ zoom: false, rotate: false }).extend([
        new FullScreen(),
      ]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      //*layer
      //layer를 정의하지 않으면 레이어가 없는 맵이 렌더링 됨, 레이어는 제공된 순서대로 렌더링
      // ✔ layer를 생성하고 조작하는 프로퍼티 및 함수로 구성된 클래스
      // ✔ Map 컨테이너 위에 여러 개의 Layers를 등록하여 보여줄 수 있음
      layers: [
        //사용할 지도 타입(Tile) 선택 및 사용할 Vector을 적용시킨다. layers[타일, Vector1, Vector2...]
        //* new Tile
        //특정 해상도의 확대/축소 수준으로 구성된 격자로 미리 렌더링 된 타일 이미지를 제공하는 레이어 소스 용으로, source라는 필수 값 필요
        new TileLayer({
          //* source: new XYZ({}) -> XYZ 타일이란?
          //지도를 이루는, 자리가 정해진 작은 타일을 불러와 보도블록으로 인도를 채우듯이 지도를 완성하는 방식
          //x와 y는 지도를 구성하는 조각의 x좌표와 y좌표라는 뜻이며 z는 zoom의 약자로, 배율 의미
          //{z}/{y}/{x} -> 이 부분은 후에 view에서 지정한 초기값으로 지정되고, 지도가 움직임에 따라 값이 자동으로 입력된다 (자동으로 채워진다)
          source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
          }),
        }),
        //* vector
        vectorLayer
      ],
      //* target -> 지도 자체의 컨테이너 또는 요소의 컨테이너이며 element의 id값 지정, div id가 map인 엘리먼트에 맵을 표출
      target: "map",
    });
    setMapObj({ map });
    return () => map.setTarget(undefined);
  }, []);


  return (
    <>
      <div
        id="map"
        style={{ position: "relative", width: "100%", height: "100vh" }}
      >
      </div>
     
    </>
  );
};

export default Map;

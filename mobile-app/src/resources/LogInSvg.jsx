import * as React from "react";
import Svg, { Defs, LinearGradient, Stop, G, Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={500}
      height={366}
      viewBox="0 0 415 366"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={0.006}
          y1={0.008}
          x2={0.514}
          y2={0.459}
          gradientUnits="objectBoundingBox"
        >
          <Stop offset={0} stopColor="#ff6a00" />
          <Stop offset={1} stopColor="#fd4040" />
        </LinearGradient>
      </Defs>
      <G data-name="Group 20">
        <Path
          data-name="Rectangle 1"
          fill="url(#prefix__a)"
          d="M0 0h415v366H0z"
        />
        <G data-name="Group 19">
          <Path
            data-name="Path 8"
            d="M211.5 168.404c-31.468-21.526-47.972-41.108-54.74-57.498-18.132-43.921 33.659-64.926 54.74-39 21.081-25.928 72.872-4.923 54.74 39-6.764 16.39-23.272 35.972-54.74 57.498z"
            fill="#fff"
          />
        </G>
        <G data-name="Group 8">
          <Path
            data-name="Path 9"
            d="M216.34 84.457a9.865 9.865 0 00-4.17 4.244q-.126.255-.243.512a16.583 16.583 0 00-.806 9.414c.524 3.152 1.577 6.186 2.401 9.273 1.893 7.086 2.56 14.693.445 21.717a42.266 42.266 0 01-6.192 11.826 33.275 33.275 0 01-6.013 6.903 1.625 1.625 0 00-.499.549.986.986 0 00.197 1.014 1.869 1.869 0 00.933.535 5.014 5.014 0 003.624-.596 33.334 33.334 0 005.295-3.92 125.971 125.971 0 0010.599-9.035 33.442 33.442 0 006.968-10.946q.295-.739.559-1.49a44.653 44.653 0 002.36-12.572 61.637 61.637 0 00-.128-12.243 27.822 27.822 0 00-2.554-8.192c-1.349-2.718-3.452-6.81-7.523-7.724a7.675 7.675 0 00-5.253.73z"
            fill="#e12325"
          />
          <Path
            data-name="Path 10"
            d="M210.096 89.645c-.002.055.302.03.349.031q.193.006.386-.005a3.415 3.415 0 00.768-.133c.259-.076.494-.203.742-.296a2.353 2.353 0 00.628-.477l.72-.615c.145-.124.327-.257.509-.201a.564.564 0 01.3.356 8.6 8.6 0 01.57 1.93 1.154 1.154 0 00.418.876.909.909 0 00.855-.095 3.171 3.171 0 001.424-1.738 4.386 4.386 0 00.126-2.267c.438.616 1.316.646 2.062.769a5.57 5.57 0 012.079.795c.225.143.517.103.372-.21a10.215 10.215 0 00-.59-1.007 3.626 3.626 0 01-.497-.995.555.555 0 01.08-.465.728.728 0 01.477-.22c1.204-.184 2.392.406 3.61.444.127.004.281-.014.335-.13s-.022-.234-.097-.329a6.638 6.638 0 00-5.26-2.18 6.491 6.491 0 00-.792.074 6.061 6.061 0 00-.621.13 3.43 3.43 0 01-1.706.239 1.968 1.968 0 01-1.135-.98 4.008 4.008 0 01.136-4.055 7.2 7.2 0 00.508-.82 1.143 1.143 0 00.056-.934 1.039 1.039 0 00-1.381-.38 2.105 2.105 0 00-.952 1.234 6.818 6.818 0 00-.325 2.355 4.782 4.782 0 00.544 2.447 4.537 4.537 0 00.743.886c.247.24.46.402.138.7-1.165 1.087-2.335 2.168-3.503 3.252l-.105.098-.994.926c-.292.273-.55.583-.834.865"
            fill="#387f45"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgComponent;

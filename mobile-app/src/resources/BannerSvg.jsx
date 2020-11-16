import * as React from "react";
import Svg, { G, Image, LinearGradient, Stop, Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 442 213.7"
      {...props}
    >
      <G transform="translate(15 5)">
        <Image
          width={484}
          height={256}
          xlinkHref="8CAC037D.png"
          transform="translate(-36 -26.346)"
          overflow="visible"
        />
        <LinearGradient
          id="prefix__a"
          gradientUnits="userSpaceOnUse"
          x1={180.529}
          y1={127.437}
          x2={181.037}
          y2={126.986}
          gradientTransform="matrix(412 0 0 -183.6536 -74376 23406.002)"
        >
          <Stop offset={0} stopColor="#ff6a00" />
          <Stop offset={1} stopColor="#fd4040" />
        </LinearGradient>
        <Path
          d="M0 0h412v164.4s-17.2-27.5-97.1-26.3-162.3 35.5-198.2 42.4C50.9 193 0 164.4 0 164.4V0z"
          fill="url(#prefix__a)"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;

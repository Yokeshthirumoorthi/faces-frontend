import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import getImageHeight from "../../utils/getImageHeight";
import getTileMeasurements from "../../utils/getTileMeasurements";
import styles from "./styles.css";

const Tile = React.memo(function Tile({
  item,
  useLqip,
  containerWidth,
  containerOffsetTop,
  getUrl,
  activeTileUrl,
  handleClick,
  windowHeight,
  scrollSpeed,
  settings
}) {
  const isExpanded = activeTileUrl === item.url;
  const isVideo = item.url.includes(".mp4") || item.url.includes(".mov");
  const [isFullSizeLoaded, setFullSizeLoaded] = useState(
    isVideo ? true : false
  );

  const { calcWidth, calcHeight, offsetX, offsetY } = getTileMeasurements({
    item,
    windowHeight,
    settings,
    containerWidth,
    containerOffsetTop
  });

  // gridPosition is what has been set by the grid layout logic (in the parent component)
  const gridPosition = `translate3d(${item.style.translateX}px, ${item.style.translateY}px, 0)`;
  // screenCenter is positioning logic for when the item is active and expanded
  const screenCenter = `translate3d(${offsetX}px, ${offsetY}px, 0)`;

  const { width, height, transform, zIndex } = useSpring({
    transform: isExpanded ? screenCenter : gridPosition,
    zIndex: isExpanded ? 10 : 0, // 10 so that it takes a little longer before settling at 0
    width: isExpanded ? Math.ceil(calcWidth) + "px" : item.style.width + "px",
    height: isExpanded
      ? Math.ceil(calcHeight) + "px"
      : item.style.height + "px",
    config: { mass: 1.5, tension: 400, friction: 40 }
  });

  function FigCaptionAvatars({ albumName, imageName, faces }) {
    return faces.map((faceId, idx) => (
      <a key={idx} href={`/album/${albumName}/${faceId}`}>
        <img
          className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src={`http://192.168.1.13:8081/static_faces/${albumName}/${imageName}_${idx}.jpg`}
        />
      </a>
    ));
  }

  return (
    <animated.figure
      className={`${styles.pigBtn}${
        isExpanded ? ` ${styles.pigBtnActive}` : ""
      } pig-btn`}
      // onClick={() => handleClick(item)}
      itemProp="associatedMedia"
      itemScope={true}
      itemType="http://schema.org/ImageObject"
      style={{
        outline: isExpanded
          ? `${settings.gridGap}px solid ${settings.bgColor}`
          : null,
        backgroundColor: item.dominantColor,
        zIndex: zIndex.interpolate(t => Math.round(t)),
        width: width.interpolate(t => t),
        height: height.interpolate(t => t),
        transform: transform.interpolate(t => t)
      }}
    >
      <a
        href={getUrl(item.url, getImageHeight(containerWidth))}
        data-size={`${Math.ceil(calcWidth)}x${Math.ceil(calcHeight)}`}
        itemProp="contentUrl"
      >
        {useLqip && (
          // LQIP
          <img
            className={`${styles.pigImg} ${styles.pigThumbnail}${
              isFullSizeLoaded ? ` ${styles.pigThumbnailLoaded}` : ""
            }`}
            src={getUrl(item.url, settings.thumbnailSize)}
            loading="lazy"
            width={item.style.width}
            height={item.style.height}
            itemProp="thumbnail"
            alt=""
          />
        )}

        {scrollSpeed === "slow" && !isVideo && (
          // grid image
          <img
            className={`${styles.pigImg} ${styles.pigFull}${
              isFullSizeLoaded ? ` ${styles.pigFullLoaded}` : ""
            }`}
            src={getUrl(item.url, getImageHeight(containerWidth))}
            alt=""
            itemProp="thumbnail"
            onLoad={() => setFullSizeLoaded(true)}
          />
        )}
      </a>
      <figcaption
        itemProp="caption description"
        className="flex -space-x-1 overflow-hidden"
      >
        <FigCaptionAvatars
          albumName={item.albumName}
          imageName={item.imageName}
          faces={item.faces}
        />
      </figcaption>

      {scrollSpeed === "slow" && isVideo && (
        <video
          className={`${styles.pigImg} ${styles.pigThumbnail}${
            isFullSizeLoaded ? ` ${styles.pigThumbnailLoaded}` : ""
          }`}
          src={getUrl(item.url, getImageHeight(containerWidth))}
          onCanPlay={() => setFullSizeLoaded(true)}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {isExpanded && !isVideo && (
        // full size expanded image
        <img
          className={styles.pigImg}
          src={getUrl(item.url, settings.expandedSize)}
          alt=""
        />
      )}

      {isExpanded && isVideo && (
        // full size expanded video
        <video
          className={styles.pigImg}
          src={getUrl(item.url, settings.expandedSize)}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </animated.figure>
  );
});

export default Tile;

Tile.propTypes = {
  item: PropTypes.object.isRequired,
  containerWidth: PropTypes.number,
  settings: PropTypes.object.isRequired,
  getUrl: PropTypes.func
};

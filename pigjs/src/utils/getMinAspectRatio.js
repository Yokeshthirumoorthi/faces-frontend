/**
 * Get the minimum required aspect ratio for a valid row of images. The
 * perfect rows are maintained by building up a row of images by adding
 * together their aspect ratios (the aspect ratio when they are placed
 * next to each other) until that aspect ratio exceeds the value returned
 * by this function. Responsive reordering is achieved through changes
 * to what this function returns at different values of the passed
 * parameter `containerWidth`.
 *
 * @param {Number} containerWidth - The last computed width of the
 *                                   container
 *
 * @returns {Number} The minimum aspect ratio at this window width.
 */
export default function(containerWidth) {
  console.log("Container width - ", containerWidth);
  if (containerWidth <= 800) return 4;
  if (containerWidth <= 1280) return 6;
  if (containerWidth <= 1920) return 8;
  return 5;
}

import React from 'react';

interface PartheniumLogoProps {
  className?: string;
  size?: number | string;
  color?: string; // default vibrant emerald #00873E
  flaskColor?: string; // default pure white #ffffff
}

/**
 * Official "Weeds to Wealth" NCSC Winning Logo:
 * Vibrant botanical green serrated Parthenium hysterophorus leaf
 * enclosing a precision white scientific Erlenmeyer flask cutout in the center.
 * Exact 1:1 vector recreation of the official competition logo.
 */
export const PartheniumLogo: React.FC<PartheniumLogoProps> = ({
  className = 'w-9 h-9',
  size,
  color = '#00873E',
  flaskColor = '#ffffff',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 1000 1000"
      className={`inline-block select-none shrink-0 ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-label="Weeds to Wealth NCSC Winning Logo"
    >
      <defs>
        {/* Precision mask creating the Erlenmeyer flask negative space cutout inside the leaf */}
        <mask id="ncscFlaskCutoutMask">
          {/* White canvas keeps all of the green leaf */}
          <rect width="1000" height="1000" fill="#ffffff" />
          
          {/* Solid black cuts out the exact Erlenmeyer flask silhouette */}
          {/* 1. Flask Top Lip */}
          <rect x="442" y="416" width="116" height="24" rx="7" fill="#000000" />
          
          {/* 2. Flask Neck */}
          <rect x="456" y="428" width="88" height="118" rx="2" fill="#000000" />
          
          {/* 3. Flask Conical Body */}
          <polygon points="456,544 544,544 628,768 372,768" fill="#000000" />
          
          {/* 4. Flask Rounded Base Corners and Flat Bottom */}
          <rect x="370" y="750" width="260" height="40" rx="20" fill="#000000" />
        </mask>
      </defs>

      {/* Symmetrical Parthenium Hysterophorus Bipinnatifid Leaf Silhouette */}
      <path
        d="M 500,74
           C 510,95 519,128 528,154
           C 544,138 572,116 592,132
           C 596,150 576,176 568,196
           C 596,180 624,170 640,190
           C 644,212 616,236 592,256
           C 628,248 670,244 688,272
           C 692,300 652,324 616,340
           C 648,336 688,340 708,368
           C 712,396 672,420 632,436
           C 668,444 712,464 716,500
           C 712,532 664,548 624,552
           C 664,568 732,600 736,648
           C 732,692 676,708 632,704
           C 668,728 720,772 704,820
           C 684,852 624,836 576,824
           C 596,852 612,884 584,912
           C 552,928 524,884 508,860
           C 506,892 508,936 500,956
           C 492,936 494,892 492,860
           C 476,884 448,928 416,912
           C 388,884 404,852 424,824
           C 376,836 316,852 296,820
           C 280,772 332,728 368,704
           C 324,708 268,692 264,648
           C 268,600 336,568 376,552
           C 336,548 288,532 284,500
           C 288,464 332,444 368,436
           C 328,420 288,396 292,368
           C 312,340 352,336 384,340
           C 348,324 308,300 312,272
           C 330,244 372,248 408,256
           C 384,236 356,212 360,190
           C 376,170 404,180 432,196
           C 424,176 404,150 408,132
           C 428,116 456,138 472,154
           C 481,128 490,95 500,74
           Z"
        fill={color}
        mask="url(#ncscFlaskCutoutMask)"
      />
    </svg>
  );
};


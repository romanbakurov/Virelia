Vellira Sans

Vellira Sans is a Latin-only UI typeface family derived from Kantumruy Pro.The family is intended for component libraries, interfaces, and applications.

Included weights

Style

Weight

ExtraLight

200

Regular

400

Medium

500

SemiBold

600

Bold

700

ExtraBold

800

Every weight is supplied in TTF and WOFF2 formats.

Bold 700 is generated from the official Kantumruy Pro 700 master.ExtraBold 800 is a strengthened derivative of the 700 master with the familymetrics preserved.

File structure

ttf/
VelliraSans-ExtraLight.ttf
VelliraSans-Regular.ttf
VelliraSans-Medium.ttf
VelliraSans-SemiBold.ttf
VelliraSans-Bold.ttf
VelliraSans-ExtraBold.ttf

woff2/
VelliraSans-ExtraLight.woff2
VelliraSans-Regular.woff2
VelliraSans-Medium.woff2
VelliraSans-SemiBold.woff2
VelliraSans-Bold.woff2
VelliraSans-ExtraBold.woff2

Web usage

Use WOFF2 files in web applications. Example:

@font-face {
font-family: "Vellira Sans";
src: url("./woff2/VelliraSans-Regular.woff2") format("woff2");
font-style: normal;
font-weight: 400;
font-display: swap;
}

@font-face {
font-family: "Vellira Sans";
src: url("./woff2/VelliraSans-Bold.woff2") format("woff2");
font-style: normal;
font-weight: 700;
font-display: swap;
}

Add an equivalent @font-face rule for every weight used by the application.

Character set

This release contains Latin characters and common punctuation, currency,mathematical, arrow, and UI symbols. Cyrillic is not included.

License

Vellira Sans is distributed under the SIL Open Font License 1.1.The original copyright and license are preserved in OFL.txt and in the fontmetadata.

Copyright 2022 The Kantumruy Pro Project Authorshttps://github.com/googlefonts/kantumruy

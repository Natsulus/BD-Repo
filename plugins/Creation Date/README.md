**Current Version**: 1.1.2

## How to Use

1. Download and Enable Plugin
2. Modify the CSS and Format in the Settings Panel
3. Click on a user for a modal popout which should also contain their Creation Date

## CSS

The display of the user's creation date can be styled as you like.

The default CSS is: `font-size: 12px; color: #fff; font-family: inherit; opacity: 0.6; margin-top: 10px;`

Class of the element is `creation-date-wrapper` if you need it for a theme or something.

## Formatting

The display of the user's creation date can be formatted along with text.

The default format is: `Created on $(dS of MMM, yyyy)$`

This plugin uses Datejs, so check out how to format the date section here: https://github.com/datejs/Datejs#converting-to-string

The formatted date section should be between `$(` and `)$`.

You can insert text within the formatted date section, however the following characters will not be escaped: `S, s, H, h, M, m, d, y`

## v2 Plan
- Get creation date for servers, channels, and messages!
- Position options
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project **does not** adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

...

## v0.6.0 – 2020-03-01

Ignore hidden tabs. This probably also fixes a syntax error for the last two versions.

### User side

* Do not count hidden tabs
  * Add an option to display them in popup
  * Add an option to count them anyways
* Revert to "wait" badge text at start, and a single space otherwise to be less noticeable

### Developer side

* Add WIP documentation
* Rework gulp tasks and npm scripts
* Update some README badges
* Add changelog

## v0.5.1 — 2020-02-18

Updating and documenting is done (tqdv).

### User side

* Hide unavailable options in the settings page
* Add version line at the end of settings page
* Handle onboarding and upboarding
* Change loading time to 2 seconds instead of 5
* Enable settings live preview

### Developer side

* Cleanup README (still old links)
* Move even more code around
* Switch from underscore.js to lodash.throttle

## v0.5.0 — 2020-02-09

First working version of the new settings page.

### User side

* Use flexbox in settings page

### Developer side

* Use more asynchronous programming
* Change settings storage format
* Move a lot of code around, and document everything a bit

### Tooling

* Add descriptions to gulp tasks
* Use webextension-polyfill for cross-platform support
* Update eslint, manifest, babel and browserlist

## v0.4.1 — 2018-10-11

Development by DaAwesomeP.

__Sakuli2 is still under development and therefore not published or considered for public use. Please use [Sakuli](https://github.com/consol/sakuli) until Sakuli2 is ready. The first release is planned for Q1 2019__

# Sakuli2

[![Build Status](https://travis-ci.com/sakuli/sakuli.svg?branch=master)](https://travis-ci.com/sakuli/sakuli) 
[![Greenkeeper badge](https://badges.greenkeeper.io/sakuli/sakuli.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/sakuli/sakuli/badge.svg?branch=master)](https://coveralls.io/github/sakuli/sakuli?branch=master)
[![SonarCloud Alert Status](https://sonarcloud.io/api/project_badges/measure?project=sakuli:sakuli&metric=alert_status)](https://sonarcloud.io/organizations/sakuli/projects)

## Why Sakuli 2?

In the past we encountered a lot of issues with the architecture of Sakuli. But first and foremost the inactive 
development of Sahi and its deep integration into Sakuli was one of the main reasons to rethink our technology stack.

So we decide to create a brandnew platform which allows users to test and monitor their systems and developers to extend 
the platform to their own needs.

## What is the new Stack of Sakuli2?

We started to make a complete core code rewrite based on NodeJs and Typescript.

- __NodeJs__ because we wanted the same language for our platform and testcases (Sakuli was written in Java while testcases where executed in a modified version of RhinoJs-Engine)
- __Typescript__ to provide clear interfaces for third-party devs.

We also replaced the engines for web- and native checks:

- __Sahi__ is replaced by Webdriver / Selenium
- __Sikuli__ is replaced by [nut.js](https://github.com/nut-tree/nut.js)

while we try our best to keep the sakuli api backwards compatible.

## What can I expect from Sakuli2...

### ...as a user / tester

Expect the full power of Sakuli, which means testing and monitoring systems either in web or native.

### ...as a developer
 
Use the full power of typescript, nodejs and their corresponding ecosystems.
